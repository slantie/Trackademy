/**
 * @file src/api/v1/auth.ts
 * @description Authentication API routes definition
 */

import { Router } from 'express';
import { AuthController } from '../../controllers/authController';
import { authenticateToken, authorizeRoles } from '../../middlewares/auth';

const router = Router();

// Authentication routes
router.post('/login', AuthController.login);

// Registration routes
router.post('/register/student', AuthController.registerStudent);
router.post('/register/faculty', AuthController.registerFaculty);

// Admin registration - protected route (only admins can create other admins)
router.post('/register/admin',
    authenticateToken,
    authorizeRoles('ADMIN'),
    AuthController.registerAdmin
);

export default router;