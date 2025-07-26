/**
 * @file src/utils/testAuth.ts
 * @description Test script for authentication system functionality
 */

import { createHashedPassword } from './passwordHelper';

/**
 * Test function to generate sample hashed passwords
 * Run this to get hashed passwords for testing
 */
async function generateTestPasswords() {
  console.log('Generating test passwords...\n');
  
  const passwords = [
    { type: 'Student', plain: 'student123' },
    { type: 'Faculty', plain: 'faculty123' },
    { type: 'Admin', plain: 'admin123' }
  ];

  for (const pwd of passwords) {
    const hashed = await createHashedPassword(pwd.plain);
    console.log(`${pwd.type} Password:`);
    console.log(`Plain: ${pwd.plain}`);
    console.log(`Hashed: ${hashed}\n`);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  generateTestPasswords().catch(console.error);
}