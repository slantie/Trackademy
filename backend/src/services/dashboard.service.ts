import { prisma } from "../config/prisma.service";

export class DashboardService {
    async getCounts() {
        const [
            colleges,
            departments,
            academicYears,
            semesters,
            divisions,
            subjects,
            faculties,
            students,
            courses,
            exams,
            examResults,
            attendances,
        ] = await Promise.all([
            prisma.college.count({ where: { isDeleted: false } }),
            prisma.department.count({ where: { isDeleted: false } }),
            prisma.academicYear.count({ where: { isDeleted: false } }),
            prisma.semester.count({ where: { isDeleted: false } }),
            prisma.division.count({ where: { isDeleted: false } }),
            prisma.subject.count({ where: { isDeleted: false } }),
            prisma.faculty.count({ where: { isDeleted: false } }),
            prisma.student.count({ where: { isDeleted: false } }),
            prisma.course.count({ where: { isDeleted: false } }),
            prisma.exam.count({ where: { isDeleted: false } }),
            prisma.examResult.count(),
            prisma.attendance.count(),
        ]);

        return {
            colleges,
            departments,
            academicYears,
            semesters,
            divisions,
            subjects,
            faculties,
            students,
            courses,
            exams,
            examResults,
            attendances,
        };
    }
}

export const dashboardService = new DashboardService();
