/**
 * @file src/api/index.ts
 * @description Main API routes aggregator
 */

import { Router } from 'express';
import authRoutes from './v1/auth';
import protectedRoutes from './v1/protected';

const router = Router();

// Mount auth routes
router.use('/auth', authRoutes);

// Mount protected routes (examples)
router.use('/protected', protectedRoutes);

export default router;