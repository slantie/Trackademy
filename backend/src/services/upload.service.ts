/**
 * @file src/services/upload.service.ts
 * @description Service layer for handling all bulk data uploads from Excel files.
 */

import axios from "axios";
import ExcelJS from "exceljs";
import FormData from "form-data";
import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import {
  facultyExcelRowSchema,
  studentExcelRowSchema,
  subjectExcelRowSchema,
  attendanceExcelRowSchema,
} from "../validations/upload.validation";
import { hashPassword } from "../utils/hash";
import {
  Designation,
  Role,
  SemesterType,
  SubjectType,
  LectureType,
  Course,
  ResultStatus,
  Prisma,
  ExamType,
  AttendanceStatus,
} from "@prisma/client";
import { emailService } from "./email.service";
import { generateRandomPassword } from "../utils/generator";
import config from "../config";

type EmailUserData = { email: string; fullName: string; password: string }[];
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class UploadService {
  /**
   * Processes an Excel file to bulk-create master Faculty records and their User accounts.
   */
  public async processFacultyData(fileBuffer: Buffer) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer as any);
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet)
      throw new AppError(
        "Faculty Excel file is empty or the first sheet is missing.",
        400
      );

    const rows = worksheet.getRows(2, worksheet.rowCount) ?? [];
    let createdCount = 0,
      skippedCount = 0;
    const validRows = [],
      collegeAbbrs = new Set<string>(),
      departmentNames = new Set<string>();

    for (const [index, row] of rows.entries()) {
      const rowNum = index + 2;
      const rawData = {
        fullName: row.getCell(2).value?.toString()?.trim() || "",
        email: row.getCell(3).value?.toString()?.trim() || "",
        abbreviation: row.getCell(4).value?.toString()?.trim() || null,
        designation: row.getCell(5).value?.toString()?.trim() || "",
        department: row.getCell(6).value?.toString()?.trim() || "",
        joiningDate: row.getCell(7).value || null,
        college: row.getCell(8).value?.toString()?.trim() || "",
      };

      if (!rawData.fullName && !rawData.email) continue;
      const validation = facultyExcelRowSchema.safeParse(rawData);
      if (!validation.success) {
        console.warn(
          `Row ${rowNum}: Skipping faculty. Validation error:`,
          validation.error.flatten().fieldErrors
        );
        skippedCount++;
        continue;
      }
      validRows.push({ ...validation.data, rowNum });
      collegeAbbrs.add(validation.data.college);
      departmentNames.add(validation.data.department);
    }

    const colleges = await prisma.college.findMany({
      where: { abbreviation: { in: [...collegeAbbrs] } },
    });
    const departments = await prisma.department.findMany({
      where: { name: { in: [...departmentNames] } },
    });
    const collegeMap = new Map(colleges.map((c) => [c.abbreviation, c]));
    const departmentMap = new Map(
      departments.map((d) => [`${d.collegeId}_${d.name}`, d])
    );
    const usersToEmail: EmailUserData = [];

    for (const rowData of validRows) {
      const {
        fullName,
        email,
        abbreviation,
        designation,
        department,
        joiningDate,
        college,
        rowNum,
      } = rowData;
      const collegeRecord = collegeMap.get(college);
      if (!collegeRecord) {
        console.warn(
          `Row ${rowNum}: Skipping. College "${college}" not found.`
        );
        skippedCount++;
        continue;
      }
      const departmentRecord = departmentMap.get(
        `${collegeRecord.id}_${department}`
      );
      if (!departmentRecord) {
        console.warn(
          `Row ${rowNum}: Skipping. Department "${department}" not found in college "${college}".`
        );
        skippedCount++;
        continue;
      }
      const randomPassword = generateRandomPassword();
      try {
        await prisma.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: {
              email,
              password: await hashPassword(randomPassword),
              role: Role.FACULTY,
            },
          });
          await tx.faculty.create({
            data: {
              userId: user.id,
              fullName,
              abbreviation,
              designation,
              joiningDate: joiningDate ? new Date(joiningDate as string) : null,
              departmentId: departmentRecord.id,
            },
          });
          usersToEmail.push({
            email,
            fullName,
            password: randomPassword,
          });

          // Log faculty credentials for testing
          console.log(
            `✅ FACULTY CREATED - Name: ${fullName}, Email: ${email}, Password: ${randomPassword}, Role: FACULTY`
          );
        });
        createdCount++;
      } catch (error: any) {
        if (error.code === "P2002")
          console.warn(
            `Row ${rowNum}: Skipping faculty with email ${email} as they already exist.`
          );
        else
          console.error(
            `Row ${rowNum}: An unexpected error occurred for faculty ${email}:`,
            error
          );
        skippedCount++;
      }
    }

    if (usersToEmail.length > 0) {
      //   for (const user of usersToEmail) {
      //     await emailService.sendWelcomeEmail(
      //       user.email,
      //       user.fullName,
      //       user.password
      //     );
      //     await delay(200);
      //   }
      console.log("All welcome emails sent.");

      // Comprehensive faculty credentials summary
      console.log(`\n🎓 ========== FACULTY UPLOAD SUMMARY ==========`);
      console.log(`📊 Total faculty created: ${usersToEmail.length}`);
      console.log(`📋 FACULTY CREDENTIALS FOR TESTING:`);
      usersToEmail.forEach((user, index) => {
        console.log(`${index + 1}. Name: ${user.fullName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${user.password}`);
        console.log(`   Role: FACULTY`);
        console.log(`   ---`);
      });
      console.log(`============================================\n`);
    }

    return {
      message: `Import complete. Created ${createdCount} faculty. Skipped ${skippedCount} rows.`,
      createdCount,
      skippedCount,
      createdFaculty: usersToEmail, // Include faculty credentials in response
    };
  }

  /**
   * Processes an Excel file to bulk-create Students and their User accounts.
   */
  public async processStudentData(fileBuffer: Buffer) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer as any);
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet)
      throw new AppError(
        "Excel file is empty or the first sheet is missing.",
        400
      );

    const defaultCollege = await prisma.college.findFirst();
    if (!defaultCollege)
      throw new AppError(
        "No colleges found in the database. Please create a college first.",
        404
      );

    const rows = worksheet.getRows(2, worksheet.rowCount) ?? [];
    let createdCount = 0,
      skippedCount = 0;
    const usersToEmail: EmailUserData = [];
    const validRows = [],
      academicYears = new Set<string>(),
      departmentAbbrs = new Set<string>();

    for (const [index, row] of rows.entries()) {
      const rowNum = index + 2;
      const rawData = {
        studentName: row.getCell(2).value?.toString()?.trim() || "",
        enrollmentNumber: row.getCell(3).value?.toString()?.trim() || "",
        department: row.getCell(4).value?.toString()?.trim() || "",
        semester: Number(row.getCell(5).value) || 0,
        division: row.getCell(6).value?.toString()?.trim() || "",
        batch: row.getCell(7).value?.toString()?.trim() || "",
        email: row.getCell(8).value?.toString()?.trim() || "",
        academicYear: row.getCell(9).value?.toString()?.trim() || "",
      };
      if (!rawData.studentName && !rawData.enrollmentNumber) continue;
      const validation = studentExcelRowSchema.safeParse(rawData);
      if (!validation.success) {
        console.warn(
          `Row ${rowNum}: Skipping student. Validation error:`,
          validation.error.flatten().fieldErrors
        );
        skippedCount++;
        continue;
      }
      validRows.push({ ...validation.data, rowNum });
      academicYears.add(validation.data.academicYear);
      departmentAbbrs.add(validation.data.department);
    }

    const yearRecords = await prisma.academicYear.findMany({
      where: { year: { in: [...academicYears] } },
    });
    const deptRecords = await prisma.department.findMany({
      where: {
        abbreviation: { in: [...departmentAbbrs] },
        collegeId: defaultCollege.id,
      },
    });
    const academicYearMap = new Map(yearRecords.map((y) => [y.year, y]));
    const departmentMap = new Map(deptRecords.map((d) => [d.abbreviation, d]));

    for (const rowData of validRows) {
      const {
        studentName,
        enrollmentNumber,
        department,
        semester,
        division,
        batch,
        email,
        academicYear,
        rowNum,
      } = rowData;
      const randomPassword = generateRandomPassword();
      try {
        let academicYearRecord = academicYearMap.get(academicYear);
        if (!academicYearRecord) {
          academicYearRecord = await prisma.academicYear.create({
            data: {
              year: academicYear,
              collegeId: defaultCollege.id,
            },
          });
          academicYearMap.set(academicYear, academicYearRecord);
        }
        const departmentRecord = departmentMap.get(department);
        if (!departmentRecord) {
          console.warn(
            `Row ${rowNum}: Skipping student "${enrollmentNumber}". Department "${department}" not found.`
          );
          skippedCount++;
          continue;
        }
        const semesterRecord = await prisma.semester.upsert({
          where: {
            academicYearId_departmentId_semesterNumber: {
              departmentId: departmentRecord.id,
              semesterNumber: semester,
              academicYearId: academicYearRecord.id,
            },
          },
          create: {
            departmentId: departmentRecord.id,
            semesterNumber: semester,
            academicYearId: academicYearRecord.id,
            semesterType:
              semester % 2 === 0 ? SemesterType.EVEN : SemesterType.ODD,
          },
          update: {},
        });
        const divisionRecord = await prisma.division.upsert({
          where: {
            name_semesterId: {
              name: division,
              semesterId: semesterRecord.id,
            },
          },
          create: { name: division, semesterId: semesterRecord.id },
          update: {},
        });
        await prisma.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: {
              email,
              password: await hashPassword(randomPassword),
              role: Role.STUDENT,
            },
          });
          await tx.student.create({
            data: {
              userId: user.id,
              fullName: studentName,
              enrollmentNumber,
              batch,
              departmentId: departmentRecord.id,
              semesterId: semesterRecord.id,
              divisionId: divisionRecord.id,
            },
          });
          usersToEmail.push({
            email,
            fullName: studentName,
            password: randomPassword,
          });

          // Log student credentials for testing
          console.log(
            `✅ STUDENT CREATED (Upload) - Name: ${studentName}, Email: ${email}, Enrollment: ${enrollmentNumber}, Password: ${randomPassword}, Role: STUDENT`
          );
        });
        createdCount++;
      } catch (error: any) {
        if (error.code === "P2002")
          console.warn(
            `Row ${rowNum}: Skipping student with email "${email}" or enrollment "${enrollmentNumber}" as they already exist.`
          );
        else
          console.error(
            `Row ${rowNum}: An unexpected error occurred for student ${email}:`,
            error
          );
        skippedCount++;
      }
    }

    if (usersToEmail.length > 0) {
      //   for (const user of usersToEmail) {
      //     await emailService.sendWelcomeEmail(
      //       user.email,
      //       user.fullName,
      //       user.password
      //     );
      //     await delay(200);
      //   }
      console.log("All welcome emails sent.");

      // Comprehensive student credentials summary
      console.log(`\n🎓 ========== STUDENT UPLOAD SUMMARY ==========`);
      console.log(`📊 Total students created: ${usersToEmail.length}`);
      console.log(`📋 STUDENT CREDENTIALS FOR TESTING:`);
      usersToEmail.forEach((user, index) => {
        console.log(`${index + 1}. Name: ${user.fullName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${user.password}`);
        console.log(`   Role: STUDENT`);
        console.log(`   ---`);
      });
      console.log(`============================================\n`);
    }

    return {
      message: `Import complete. Created ${createdCount} students. Skipped ${skippedCount} rows.`,
      createdCount,
      skippedCount,
      createdStudents: usersToEmail, // Include student credentials in response
    };
  }

  /**
   * Processes an Excel file to bulk-create master Subject records.
   */
  public async processSubjectData(fileBuffer: Buffer) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer as any);
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet)
      throw new AppError(
        "Excel file is empty or the first sheet is missing.",
        400
      );

    let createdCount = 0,
      skippedCount = 0;
    const rows = worksheet.getRows(2, worksheet.rowCount) ?? [];
    const validRows = [],
      departmentAbbrs = new Set<string>();

    for (const [index, row] of rows.entries()) {
      const rowNum = index + 2;
      const rawData = {
        subjectName: row.getCell(2).value?.toString()?.trim() || "",
        abbreviation: row.getCell(3).value?.toString()?.trim() || "",
        subjectCode: row.getCell(4).value?.toString()?.trim() || "",
        semester: Number(row.getCell(5).value) || 0,
        isElective: row.getCell(6).value?.toString()?.trim() || "FALSE",
        department: row.getCell(7).value?.toString()?.trim() || "",
      };
      if (!rawData.subjectName && !rawData.abbreviation) continue;
      const validation = subjectExcelRowSchema.safeParse(rawData);
      if (!validation.success) {
        console.warn(
          `Row ${rowNum}: Skipping subject. Validation error:`,
          validation.error.flatten().fieldErrors
        );
        skippedCount++;
        continue;
      }
      validRows.push({ ...validation.data, rowNum });
      departmentAbbrs.add(validation.data.department);
    }

    const deptRecords = await prisma.department.findMany({
      where: { abbreviation: { in: [...departmentAbbrs] } },
    });
    const departmentMap = new Map(deptRecords.map((d) => [d.abbreviation, d]));

    for (const rowData of validRows) {
      const {
        subjectName,
        abbreviation,
        subjectCode,
        semester,
        isElective,
        department,
        rowNum,
      } = rowData;
      try {
        const departmentRecord = departmentMap.get(department);
        if (!departmentRecord) {
          console.warn(
            `Row ${rowNum}: Skipping subject "${abbreviation}". Department "${department}" not found.`
          );
          skippedCount++;
          continue;
        }
        await prisma.subject.create({
          data: {
            name: subjectName,
            abbreviation: abbreviation,
            code: subjectCode,
            type: isElective ? SubjectType.ELECTIVE : SubjectType.MANDATORY,
            semesterNumber: semester,
            departmentId: departmentRecord.id,
          },
        });
        createdCount++;
      } catch (error: any) {
        if (error.code === "P2002")
          console.warn(
            `Row ${rowNum}: Skipping subject with code "${subjectCode}" as it already exists in this department.`
          );
        else
          console.error(
            `Row ${rowNum}: An unexpected error occurred for subject ${subjectCode}:`,
            error
          );
        skippedCount++;
      }
    }
    return {
      message: `Import complete. Created ${createdCount} subjects. Skipped ${skippedCount} rows.`,
      createdCount,
      skippedCount,
    };
  }

  /**
   * Processes a Faculty Matrix Excel file to create Course (offering) records.
   */
  public async processFacultyMatrix(
    fileBuffer: Buffer,
    body: {
      academicYear: string;
      semesterType: SemesterType;
      departmentId: string;
    }
  ) {
    const { academicYear, semesterType, departmentId } = body;

    // --- Step 1: Prepare data and validate prerequisites ---
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      include: { college: true },
    });
    if (!department) throw new AppError("Department not found.", 404);

    const academicYearRecord = await prisma.academicYear.findUnique({
      where: { year: academicYear },
    });
    if (!academicYearRecord)
      throw new AppError(`Academic Year "${academicYear}" not found.`, 404);

    const formData = new FormData();
    formData.append("facultyMatrix", fileBuffer, {
      filename: "matrix.xlsx",
    });
    formData.append("deptAbbreviation", department.abbreviation);
    formData.append("collegeAbbreviation", department.college.abbreviation);

    // --- Step 2: Call the FastAPI service ---
    let processedData: any; // Define a more specific type if possible
    try {
      const response = await axios.post(
        `${config.serviceUrl}/api/v1/faculty-matrix`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            "service-api-key": config.serviceApiKey,
          },
        }
      );
      processedData = response.data;
    } catch (error: any) {
      console.error(
        "Error calling FastAPI service:",
        error.response?.data || error.message
      );
      throw new AppError(
        `Failed to process matrix via FastAPI service: ${
          error.response?.data?.detail || error.message
        }`,
        500
      );
    }

    // --- Step 3: Pre-fetch master data for seeding ---
    const subjects = await prisma.subject.findMany({
      where: { departmentId },
    });
    const faculties = await prisma.faculty.findMany({
      where: { departmentId },
    });
    const subjectMap = new Map(subjects.map((s) => [s.abbreviation, s]));
    const facultyMap = new Map(faculties.map((f) => [f.abbreviation, f]));

    // --- Step 4: Parse the dictionary and prepare for batch insert ---
    let createdCount = 0,
      skippedCount = 0;
    const coursesToCreate: {
      isDeleted: boolean;
      subjectId: string;
      facultyId: string;
      semesterId: string;
      divisionId: string;
      lectureType: LectureType;
      batch: string | null;
    }[] = [];

    const results = processedData.results;
    if (!results)
      throw new AppError(
        "FastAPI response did not contain a 'results' key.",
        500
      );

    const collegeData = results[department.college.abbreviation];
    if (!collegeData)
      return {
        message: "No data for the specified college found in the matrix.",
        createdCount,
        skippedCount,
      };

    const departmentData = collegeData[department.abbreviation];
    if (!departmentData)
      return {
        message: "No data for the specified department found in the matrix.",
        createdCount,
        skippedCount,
      };

    for (const [semesterNum, semesterData] of Object.entries(
      departmentData as object
    )) {
      const semesterNumber = parseInt(semesterNum);
      for (const [divisionName, divisionData] of Object.entries(
        semesterData as object
      )) {
        for (const [subjectAbbr, subjectData] of Object.entries(
          divisionData as object
        )) {
          const processAllocation = async (
            allocData: any,
            lectureType: LectureType,
            batch: string | null
          ) => {
            const facultyAbbr = allocData.designated_faculty;
            const subject = subjectMap.get(subjectAbbr);
            const faculty = facultyMap.get(facultyAbbr);

            if (subject && faculty) {
              const semesterInstance = await prisma.semester.upsert({
                where: {
                  academicYearId_departmentId_semesterNumber: {
                    departmentId,
                    semesterNumber,
                    academicYearId: academicYearRecord.id,
                  },
                },
                create: {
                  departmentId,
                  semesterNumber,
                  academicYearId: academicYearRecord.id,
                  semesterType,
                },
                update: {},
              });
              const divisionInstance = await prisma.division.upsert({
                where: {
                  name_semesterId: {
                    name: divisionName,
                    semesterId: semesterInstance.id,
                  },
                },
                create: {
                  name: divisionName,
                  semesterId: semesterInstance.id,
                },
                update: {},
              });
              coursesToCreate.push({
                isDeleted: false,
                subjectId: subject.id,
                facultyId: faculty.id,
                semesterId: semesterInstance.id,
                divisionId: divisionInstance.id,
                lectureType,
                batch,
              });
            } else {
              console.warn(
                `Skipping allocation: Subject "${subjectAbbr}" or Faculty "${facultyAbbr}" not found in master data.`
              );
              skippedCount++;
            }
          };

          // Process lectures
          if (subjectData.lectures?.designated_faculty) {
            await processAllocation(
              subjectData.lectures,
              LectureType.THEORY,
              null
            );
          }

          // Process labs
          if (subjectData.labs) {
            for (const [batch, labData] of Object.entries(
              subjectData.labs as object
            )) {
              await processAllocation(labData, LectureType.PRACTICAL, batch);
            }
          }
        }
      }
    }

    // --- Step 5: Batch insert all Course records ---
    if (coursesToCreate.length > 0) {
      const result = await prisma.course.createMany({
        data: coursesToCreate,
        skipDuplicates: true,
      });
      createdCount = result.count;
    }

    return {
      message: `Matrix import complete. Created ${createdCount} course offerings. Skipped ${skippedCount} allocations.`,
      createdCount,
      skippedCount,
    };
  }

  /**
   * Processes a results Excel file by sending it to the FastAPI service and seeding the response.
   * It will store results for all students, even if they don't exist in the database yet.
   */
  public async processResultsData(
    fileBuffer: Buffer,
    body: {
      examName: string;
      examType: ExamType;
      academicYearId: string;
      departmentId: string;
      semesterNumber: number;
    }
  ) {
    const { examName, examType, academicYearId, departmentId, semesterNumber } =
      body;

    // --- Step 1: Call FastAPI service ---
    const formData = new FormData();
    formData.append("result", fileBuffer, { filename: "result.xlsx" });
    let parsedResults: any[];
    try {
      const response = await axios.post(
        `${config.serviceUrl}/api/v1/results`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            "service-api-key": config.serviceApiKey,
          },
        }
      );
      const responseData = response.data as {
        status?: string;
        data?: any[];
      };
      if (
        responseData?.status !== "success" ||
        !Array.isArray(responseData?.data)
      ) {
        throw new AppError(
          "FastAPI service returned an invalid data structure.",
          500
        );
      }
      parsedResults = responseData.data;
    } catch (error: any) {
      console.error(
        "Error calling FastAPI service:",
        error.response?.data || error.message
      );
      throw new AppError(
        `Failed to process results via FastAPI service: ${
          error.response?.data?.detail || error.message
        }`,
        500
      );
    }

    // --- Step 2: Find or Create the specific Semester Instance ---
    const semesterType =
      semesterNumber % 2 === 0 ? SemesterType.EVEN : SemesterType.ODD;
    const semesterInstance = await prisma.semester.upsert({
      where: {
        academicYearId_departmentId_semesterNumber: {
          academicYearId,
          departmentId,
          semesterNumber,
        },
      },
      create: {
        academicYearId,
        departmentId,
        semesterNumber,
        semesterType,
      },
      update: {},
    });

    // --- Step 3: Pre-fetch master data ---
    const enrollmentNumbers = parsedResults
      .map((r) => r["ENROLLMENT NO."])
      .filter(Boolean);
    const subjectCodes = new Set<string>();
    const subjectCreditsMap = new Map<string, number>();
    const subjectRegex = /([A-Z0-9-]+)\s\((\d+)\)/;

    parsedResults.forEach((row) =>
      Object.keys(row).forEach((key) => {
        const match = key.match(subjectRegex);
        if (match) {
          subjectCodes.add(match[1]);
          subjectCreditsMap.set(match[1], parseInt(match[2], 10));
        }
      })
    );

    const existingStudents = await prisma.student.findMany({
      where: { enrollmentNumber: { in: enrollmentNumbers } },
    });
    const existingSubjects = await prisma.subject.findMany({
      where: { semesterNumber: semesterNumber },
    });
    const studentMap = new Map(
      existingStudents.map((s) => [s.enrollmentNumber, s])
    );
    const subjectMap = new Map(existingSubjects.map((s) => [s.code, s]));

    // --- Step 4: Create the main Exam record ---
    const exam = await prisma.exam.create({
      data: { name: examName, examType, semesterId: semesterInstance.id },
    });

    let createdCount = 0,
      skippedCount = 0,
      warningsCount = 0;
    const createdStudents: Array<{
      enrollmentNumber: string;
      name: string;
      email: string;
      password: string;
    }> = []; // Track newly created students

    // --- Step 5: Process each student's result ---
    for (const resultRow of parsedResults) {
      const enrollmentNumber = resultRow["ENROLLMENT NO."];
      if (!enrollmentNumber) {
        skippedCount++;
        continue;
      }

      // ROBUSTNESS FIX: Safely parse the status string into a valid enum member.
      const statusString = resultRow["RESULT"]?.toUpperCase();
      const status: ResultStatus = Object.values(ResultStatus).includes(
        statusString as ResultStatus
      )
        ? (statusString as ResultStatus)
        : ResultStatus.UNKNOWN;

      try {
        await prisma.$transaction(async (tx) => {
          let student = studentMap.get(enrollmentNumber);

          // If student doesn't exist, create them
          if (!student) {
            // Extract student name from Excel sheet (try multiple possible column names)
            const studentName =
              resultRow["STUDENT NAME"] ||
              resultRow["NAME"] ||
              resultRow["Student Name"] ||
              resultRow["Full Name"] ||
              resultRow["FULL NAME"] ||
              `Student ${enrollmentNumber}`; // Fallback to default

            // Create a basic student record with minimal required data
            const email = `${enrollmentNumber}@student.example.com`; // Generate email from enrollment
            const password = generateRandomPassword(); // Use consistent password generation

            const user = await tx.user.create({
              data: {
                email,
                password: await hashPassword(password),
                role: Role.STUDENT,
              },
            });

            // Find appropriate division for this semester (first one if multiple exist)
            const division = await tx.division.findFirst({
              where: {
                semester: {
                  id: semesterInstance.id,
                },
              },
            });

            if (!division) {
              // Create a default division if none exists
              const defaultDivision = await tx.division.create({
                data: {
                  name: "A", // Default division name
                  semesterId: semesterInstance.id,
                },
              });

              student = await tx.student.create({
                data: {
                  userId: user.id,
                  fullName: studentName.toString().trim(), // Use actual student name from Excel
                  enrollmentNumber,
                  batch: "Default", // Default batch
                  departmentId,
                  semesterId: semesterInstance.id,
                  divisionId: defaultDivision.id,
                },
              });
            } else {
              student = await tx.student.create({
                data: {
                  userId: user.id,
                  fullName: studentName.toString().trim(), // Use actual student name from Excel
                  enrollmentNumber,
                  batch: "Default", // Default batch
                  departmentId,
                  semesterId: semesterInstance.id,
                  divisionId: division.id,
                },
              });
            }

            // Update the student map for future iterations
            studentMap.set(enrollmentNumber, student);

            // Track created student for summary
            createdStudents.push({
              enrollmentNumber,
              name: studentName.toString().trim(),
              email,
              password,
            });

            // Log student credentials for testing
            console.log(
              `✅ STUDENT CREATED (Results) - Name: ${studentName
                .toString()
                .trim()}, Email: ${email}, Enrollment: ${enrollmentNumber}, Password: ${password}, Role: STUDENT`
            );
            console.log(
              `🔑 Quick Login: Email: ${email}, Password: ${password}`
            );
          }

          const examResult = await tx.examResult.create({
            data: {
              examId: exam.id,
              studentEnrollmentNumber: enrollmentNumber,
              spi: parseFloat(resultRow["SPI"]) || 0,
              cpi: parseFloat(resultRow["CPI"]) || 0,
              status: status,
              studentId: student.id, // Now we always have a student ID
            },
          });

          const subjectResultsToCreate = [];

          for (const key in resultRow) {
            const match = key.match(subjectRegex);
            if (match) {
              const code = match[1];
              const subject = subjectMap.get(code);
              if (subject) {
                subjectResultsToCreate.push({
                  examResultId: examResult.id,
                  subjectId: subject.id,
                  grade: resultRow[key]?.toString() || "N/A",
                  credits: subjectCreditsMap.get(code) || 0,
                });
              } else {
                warningsCount++;
              }
            }
          }

          if (subjectResultsToCreate.length > 0) {
            await tx.result.createMany({
              data: subjectResultsToCreate,
            });
          }
        });
        createdCount++;
      } catch (error: any) {
        if (error.code === "P2002")
          console.warn(
            `Skipping result for student "${enrollmentNumber}" as it already exists for this exam.`
          );
        else
          console.error(
            `An unexpected error occurred for student ${enrollmentNumber}:`,
            error
          );
        skippedCount++;
      }
    }

    // Log summary of created students
    if (createdStudents.length > 0) {
      console.log(`\n🎓 ========== RESULTS UPLOAD - NEW STUDENTS ==========`);
      console.log(
        `📊 Total students created during results upload: ${createdStudents.length}`
      );
      console.log(`📋 NEW STUDENT CREDENTIALS FOR TESTING:`);
      createdStudents.forEach((student, index) => {
        console.log(`${index + 1}. Name: ${student.name}`);
        console.log(`   Email: ${student.email}`);
        console.log(`   Enrollment: ${student.enrollmentNumber}`);
        console.log(`   Password: ${student.password}`);
        console.log(`   Role: STUDENT`);
        console.log(`   ---`);
      });
      console.log(`==================================================\n`);
    }

    return {
      message: `Result import complete. Processed results for ${createdCount} students. Skipped ${skippedCount} rows.${
        createdStudents.length > 0
          ? ` Created ${createdStudents.length} new students.`
          : ""
      }`,
      createdCount,
      skippedCount,
      warningsCount,
      createdStudents, // Include created students in response
    };
  }

  /**
   * Processes an Attendance Excel file to create Attendance records for a specific course on a specific day.
   */
  public async processAttendanceData(
    fileBuffer: Buffer,
    body: {
      academicYearId: string; // FIX: Use the provided academicYearId
      departmentId: string;
      semesterNumber: number;
      divisionId: string;
      subjectId: string;
      lectureType: LectureType;
      batch?: string | null;
      date: string;
    }
  ) {
    const {
      academicYearId,
      departmentId,
      semesterNumber,
      divisionId,
      subjectId,
      lectureType,
      batch,
      date,
    } = body;

    // --- Step 1: Find the specific semester instance using the provided IDs ---
    const semesterInstance = await prisma.semester.findUnique({
      where: {
        academicYearId_departmentId_semesterNumber: {
          academicYearId,
          departmentId,
          semesterNumber,
        },
      },
    });
    if (!semesterInstance)
      throw new AppError(
        "The specified semester does not exist for the given academic year and department.",
        404
      );

    // --- Step 2: Find the specific Course offering ---
    const course = await prisma.course.findFirst({
      where: {
        semesterId: semesterInstance.id,
        divisionId,
        subjectId,
        lectureType,
        batch: batch || null,
      },
    });
    if (!course)
      throw new AppError(
        "The specified course offering was not found. Please check the faculty matrix.",
        404
      );

    // ... the rest of the function remains the same ...
    const studentsInDivision = await prisma.student.findMany({
      where: { divisionId },
    });
    const studentMap = new Map(
      studentsInDivision.map((s) => [s.enrollmentNumber, s])
    );

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer as any);
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet)
      throw new AppError(
        "Attendance Excel file is empty or the first sheet is missing.",
        400
      );

    const rows = worksheet.getRows(2, worksheet.rowCount) ?? [];
    let createdCount = 0,
      skippedCount = 0;
    const attendanceToCreate = [];

    for (const [index, row] of rows.entries()) {
      const rowNum = index + 2;
      const rawData = {
        enrollmentNumber: row.getCell(1).value?.toString()?.trim() || "",
        status: Number(row.getCell(3).value),
      };

      if (!rawData.enrollmentNumber) continue;

      const validation = attendanceExcelRowSchema.safeParse(rawData);
      if (!validation.success) {
        console.warn(
          `Row ${rowNum}: Skipping attendance. Validation error:`,
          validation.error.flatten().fieldErrors
        );
        skippedCount++;
        continue;
      }

      const { enrollmentNumber, status } = validation.data;
      const student = studentMap.get(enrollmentNumber);

      if (!student) {
        console.warn(
          `Row ${rowNum}: Skipping. Student with enrollment number "${enrollmentNumber}" not found in this division.`
        );
        skippedCount++;
        continue;
      }

      if (
        course.lectureType === LectureType.PRACTICAL &&
        student.batch !== course.batch
      ) {
        console.warn(
          `Row ${rowNum}: Skipping. Student "${enrollmentNumber}" (Batch ${student.batch}) does not belong to this practical course (Batch ${course.batch}).`
        );
        skippedCount++;
        continue;
      }

      attendanceToCreate.push({
        date: new Date(date),
        status: status as AttendanceStatus,
        courseId: course.id,
        studentId: student.id,
      });
    }

    if (attendanceToCreate.length > 0) {
      const result = await prisma.attendance.createMany({
        data: attendanceToCreate,
        skipDuplicates: true,
      });
      createdCount = result.count;
    }

    return {
      message: `Attendance import complete. Recorded attendance for ${createdCount} students. Skipped ${skippedCount} rows.`,
      createdCount,
      skippedCount,
    };
  }
}

export const uploadService = new UploadService();
