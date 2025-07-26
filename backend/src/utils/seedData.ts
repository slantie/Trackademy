/**
 * @file src/utils/seedData.ts
 * @description Seed script to create initial data for testing the authentication system
 */

import prisma from '../config/database';
import { hashPassword } from './auth';

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Create College
        const college = await prisma.college.upsert({
            where: { name: 'LDRP Institute of Technology and Research' },
            update: {},
            create: {
                name: 'LDRP Institute of Technology and Research'
            }
        });
        console.log('✅ College created:', college.name);

        // Create Academic Year
        const academicYear = await prisma.academicYear.upsert({
            where: { year: '2025-2026' },
            update: {},
            create: {
                year: '2025-2026',
                collegeId: college.id
            }
        });
        console.log('✅ Academic Year created:', academicYear.year);

        // Create Department
        const department = await prisma.department.upsert({
            where: {
                code_academicYearId: {
                    code: 'CE',
                    academicYearId: academicYear.id
                }
            },
            update: {},
            create: {
                name: 'Computer Engineering',
                code: 'CE',
                academicYearId: academicYear.id
            }
        });
        console.log('✅ Department created:', department.name);

        // Create Semester
        const semester = await prisma.semester.upsert({
            where: {
                semesterNumber_departmentId: {
                    semesterNumber: 7,
                    departmentId: department.id
                }
            },
            update: {},
            create: {
                semesterNumber: 7,
                departmentId: department.id
            }
        });
        console.log('✅ Semester created: Semester', semester.semesterNumber);

        // Create Division
        const division = await prisma.division.upsert({
            where: {
                name_semesterId: {
                    name: 'A',
                    semesterId: semester.id
                }
            },
            update: {},
            create: {
                name: 'A',
                semesterId: semester.id
            }
        });
        console.log('✅ Division created:', division.name);

        // Create Admin User
        const adminPassword = await hashPassword('admin123');
        const adminUser = await prisma.user.upsert({
            where: { email: 'admin@ldrp.edu' },
            update: {},
            create: {
                email: 'admin@ldrp.edu',
                password: adminPassword,
                role: 'ADMIN'
            }
        });
        console.log('✅ Admin user created:', adminUser.email);

        // Create Faculty User
        const facultyPassword = await hashPassword('faculty123');
        const facultyUser = await prisma.user.upsert({
            where: { email: 'faculty@ldrp.edu' },
            update: {},
            create: {
                email: 'faculty@ldrp.edu',
                password: facultyPassword,
                role: 'FACULTY'
            }
        });

        const faculty = await prisma.faculty.upsert({
            where: { userId: facultyUser.id },
            update: {},
            create: {
                fullName: 'Dr. Jane Smith',
                designation: 'Assistant Professor',
                userId: facultyUser.id,
                departmentId: department.id
            }
        });
        console.log('✅ Faculty created:', faculty.fullName);

        // Create Student User
        const studentPassword = await hashPassword('student123');
        const studentUser = await prisma.user.upsert({
            where: { email: 'student@ldrp.edu' },
            update: {},
            create: {
                email: 'student@ldrp.edu',
                password: studentPassword,
                role: 'STUDENT'
            }
        });

        const student = await prisma.student.upsert({
            where: { enrollmentNumber: '210303105123' },
            update: {},
            create: {
                enrollmentNumber: '210303105123',
                fullName: 'John Doe',
                userId: studentUser.id,
                divisionId: division.id
            }
        });
        console.log('✅ Student created:', student.fullName);

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📋 Test Credentials:');
        console.log('Admin: admin@ldrp.edu / admin123');
        console.log('Faculty: faculty@ldrp.edu / faculty123');
        console.log('Student: 210303105123 / student123');
        console.log('\n📝 Important IDs for testing:');
        console.log(`Division ID: ${division.id}`);
        console.log(`Department ID: ${department.id}`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run if this file is executed directly
if (require.main === module) {
    seedDatabase();
}

export { seedDatabase };