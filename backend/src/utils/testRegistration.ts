/**
 * @file src/utils/testRegistration.ts
 * @description Test script for registration endpoints with sample data
 */

// Sample registration data for testing
export const sampleRegistrationData = {
    student: {
        email: "student@example.com",
        password: "student123",
        enrollmentNumber: "210303105123",
        fullName: "John Doe",
        divisionId: "division_id_here" // Replace with actual division ID from your database
    },

    faculty: {
        email: "faculty@example.com",
        password: "faculty123",
        fullName: "Dr. Jane Smith",
        designation: "Assistant Professor",
        departmentId: "department_id_here" // Replace with actual department ID from your database
    },

    admin: {
        email: "admin@example.com",
        password: "admin123"
    }
};

/**
 * Generate curl commands for testing registration endpoints
 */
export function generateTestCommands() {
    const baseUrl = "http://localhost:4000/api/auth";

    console.log("=== REGISTRATION TEST COMMANDS ===\n");

    console.log("1. Register Student:");
    console.log(`curl -X POST ${baseUrl}/register/student \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(sampleRegistrationData.student, null, 2)}'`);

    console.log("\n2. Register Faculty:");
    console.log(`curl -X POST ${baseUrl}/register/faculty \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(sampleRegistrationData.faculty, null, 2)}'`);

    console.log("\n3. Register Admin (requires admin token):");
    console.log(`curl -X POST ${baseUrl}/register/admin \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \\
  -d '${JSON.stringify(sampleRegistrationData.admin, null, 2)}'`);

    console.log("\n=== LOGIN TEST COMMANDS ===\n");

    console.log("1. Student Login:");
    console.log(`curl -X POST ${baseUrl}/login \\
  -H "Content-Type: application/json" \\
  -d '{"identifier": "${sampleRegistrationData.student.enrollmentNumber}", "password": "${sampleRegistrationData.student.password}"}'`);

    console.log("\n2. Faculty Login:");
    console.log(`curl -X POST ${baseUrl}/login \\
  -H "Content-Type: application/json" \\
  -d '{"identifier": "${sampleRegistrationData.faculty.email}", "password": "${sampleRegistrationData.faculty.password}"}'`);

    console.log("\n3. Admin Login:");
    console.log(`curl -X POST ${baseUrl}/login \\
  -H "Content-Type: application/json" \\
  -d '{"identifier": "${sampleRegistrationData.admin.email}", "password": "${sampleRegistrationData.admin.password}"}'`);
}

// Run if this file is executed directly
if (require.main === module) {
    generateTestCommands();
}