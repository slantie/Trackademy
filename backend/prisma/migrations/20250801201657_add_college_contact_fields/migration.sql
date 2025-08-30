-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('STUDENT', 'FACULTY', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."Designation" AS ENUM ('HOD', 'PROFESSOR', 'ASST_PROFESSOR', 'LAB_ASSISTANT');

-- CreateEnum
CREATE TYPE "public"."SemesterType" AS ENUM ('ODD', 'EVEN');

-- CreateEnum
CREATE TYPE "public"."SubjectType" AS ENUM ('MANDATORY', 'ELECTIVE');

-- CreateEnum
CREATE TYPE "public"."LectureType" AS ENUM ('THEORY', 'PRACTICAL');

-- CreateEnum
CREATE TYPE "public"."ExamType" AS ENUM ('MIDTERM', 'REMEDIAL', 'FINAL', 'REPEAT');

-- CreateEnum
CREATE TYPE "public"."ResultStatus" AS ENUM ('PASS', 'FAIL', 'TRIAL', 'ABSENT', 'UNKNOWN', 'WITHHELD');

-- CreateEnum
CREATE TYPE "public"."AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'MEDICAL_LEAVE', 'AUTHORIZED_LEAVE');

-- CreateTable
CREATE TABLE "public"."colleges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "website" TEXT,
    "address" TEXT,
    "contactNumber" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "colleges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "public"."SubjectType" NOT NULL DEFAULT 'MANDATORY',
    "semesterNumber" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "departmentId" TEXT NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."faculties" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "designation" "public"."Designation" NOT NULL,
    "abbreviation" TEXT,
    "joiningDate" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,

    CONSTRAINT "faculties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."academic_years" (
    "id" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "collegeId" TEXT NOT NULL,

    CONSTRAINT "academic_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."semesters" (
    "id" TEXT NOT NULL,
    "semesterNumber" INTEGER NOT NULL,
    "semesterType" "public"."SemesterType" NOT NULL,
    "departmentId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "semesters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."divisions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "divisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."courses" (
    "id" TEXT NOT NULL,
    "lectureType" "public"."LectureType" NOT NULL,
    "batch" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "subjectId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "divisionId" TEXT NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."student_enrollments" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "student_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."students" (
    "id" TEXT NOT NULL,
    "enrollmentNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "divisionId" TEXT NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."exams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Untitled Exam',
    "examType" "public"."ExamType" NOT NULL,
    "semesterId" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."exam_results" (
    "id" TEXT NOT NULL,
    "studentEnrollmentNumber" TEXT NOT NULL,
    "spi" DOUBLE PRECISION NOT NULL,
    "cpi" DOUBLE PRECISION NOT NULL,
    "status" "public"."ResultStatus" NOT NULL,
    "studentId" TEXT,
    "examId" TEXT NOT NULL,

    CONSTRAINT "exam_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."results" (
    "id" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "examResultId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."attendances" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "public"."AttendanceStatus" NOT NULL,
    "courseId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "colleges_name_key" ON "public"."colleges"("name");

-- CreateIndex
CREATE UNIQUE INDEX "colleges_abbreviation_key" ON "public"."colleges"("abbreviation");

-- CreateIndex
CREATE INDEX "departments_collegeId_idx" ON "public"."departments"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "departments_collegeId_name_key" ON "public"."departments"("collegeId", "name");

-- CreateIndex
CREATE INDEX "subjects_departmentId_idx" ON "public"."subjects"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_code_departmentId_key" ON "public"."subjects"("code", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "faculties_userId_key" ON "public"."faculties"("userId");

-- CreateIndex
CREATE INDEX "faculties_departmentId_idx" ON "public"."faculties"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "academic_years_year_key" ON "public"."academic_years"("year");

-- CreateIndex
CREATE INDEX "academic_years_collegeId_idx" ON "public"."academic_years"("collegeId");

-- CreateIndex
CREATE INDEX "semesters_departmentId_idx" ON "public"."semesters"("departmentId");

-- CreateIndex
CREATE INDEX "semesters_academicYearId_idx" ON "public"."semesters"("academicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "semesters_academicYearId_departmentId_semesterNumber_key" ON "public"."semesters"("academicYearId", "departmentId", "semesterNumber");

-- CreateIndex
CREATE INDEX "divisions_semesterId_idx" ON "public"."divisions"("semesterId");

-- CreateIndex
CREATE UNIQUE INDEX "divisions_name_semesterId_key" ON "public"."divisions"("name", "semesterId");

-- CreateIndex
CREATE INDEX "courses_subjectId_idx" ON "public"."courses"("subjectId");

-- CreateIndex
CREATE INDEX "courses_facultyId_idx" ON "public"."courses"("facultyId");

-- CreateIndex
CREATE INDEX "courses_semesterId_idx" ON "public"."courses"("semesterId");

-- CreateIndex
CREATE INDEX "courses_divisionId_idx" ON "public"."courses"("divisionId");

-- CreateIndex
CREATE UNIQUE INDEX "courses_subjectId_facultyId_semesterId_divisionId_lectureTy_key" ON "public"."courses"("subjectId", "facultyId", "semesterId", "divisionId", "lectureType", "batch");

-- CreateIndex
CREATE INDEX "student_enrollments_studentId_idx" ON "public"."student_enrollments"("studentId");

-- CreateIndex
CREATE INDEX "student_enrollments_courseId_idx" ON "public"."student_enrollments"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "student_enrollments_studentId_courseId_key" ON "public"."student_enrollments"("studentId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "students_enrollmentNumber_key" ON "public"."students"("enrollmentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "public"."students"("userId");

-- CreateIndex
CREATE INDEX "students_departmentId_idx" ON "public"."students"("departmentId");

-- CreateIndex
CREATE INDEX "students_semesterId_idx" ON "public"."students"("semesterId");

-- CreateIndex
CREATE INDEX "students_divisionId_idx" ON "public"."students"("divisionId");

-- CreateIndex
CREATE INDEX "exams_semesterId_idx" ON "public"."exams"("semesterId");

-- CreateIndex
CREATE UNIQUE INDEX "exams_semesterId_examType_key" ON "public"."exams"("semesterId", "examType");

-- CreateIndex
CREATE INDEX "exam_results_studentId_idx" ON "public"."exam_results"("studentId");

-- CreateIndex
CREATE INDEX "exam_results_examId_idx" ON "public"."exam_results"("examId");

-- CreateIndex
CREATE INDEX "exam_results_studentEnrollmentNumber_idx" ON "public"."exam_results"("studentEnrollmentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "exam_results_examId_studentEnrollmentNumber_key" ON "public"."exam_results"("examId", "studentEnrollmentNumber");

-- CreateIndex
CREATE INDEX "results_examResultId_idx" ON "public"."results"("examResultId");

-- CreateIndex
CREATE INDEX "results_subjectId_idx" ON "public"."results"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "results_examResultId_subjectId_key" ON "public"."results"("examResultId", "subjectId");

-- CreateIndex
CREATE INDEX "attendances_courseId_idx" ON "public"."attendances"("courseId");

-- CreateIndex
CREATE INDEX "attendances_studentId_idx" ON "public"."attendances"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_courseId_studentId_date_key" ON "public"."attendances"("courseId", "studentId", "date");
