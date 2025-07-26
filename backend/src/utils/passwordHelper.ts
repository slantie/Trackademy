/**
 * @file src/utils/passwordHelper.ts
 * @description Helper utility for password operations during user registration
 */

import { hashPassword } from './auth';

/**
 * Helper function to hash passwords during user creation
 * This can be used in seed scripts or registration endpoints
 */
export const createHashedPassword = async (plainPassword: string): Promise<string> => {
  return await hashPassword(plainPassword);
};

/**
 * Example usage for creating test users with hashed passwords
 */
export const createTestPasswords = async () => {
  const passwords = {
    student: await createHashedPassword('student123'),
    faculty: await createHashedPassword('faculty123'),
    admin: await createHashedPassword('admin123')
  };
  
  console.log('Test passwords (hashed):');
  console.log(passwords);
  return passwords;
};