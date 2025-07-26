/**
 * @file src/api/v1/protected.ts
 * @description Example protected routes demonstrating authentication middleware usage
 */

import { Router, Request, Response } from 'express';
import { authenticateToken, authorizeRoles } from '../../middlewares/auth';

const router = Router();

// Protected route - requires valid JWT token
router.get('/profile', authenticateToken, (req: Request, res: Response) => {
  res.json({
    message: 'Profile access granted',
    user: req.user
  });
});

// Faculty and Admin only route
router.get('/faculty-dashboard',
  authenticateToken,
  authorizeRoles('FACULTY', 'ADMIN'),
  (req: Request, res: Response) => {
    res.json({
      message: 'Faculty dashboard access granted',
      user: req.user
    });
  }
);

// Admin only route
router.get('/admin-panel',
  authenticateToken,
  authorizeRoles('ADMIN'),
  (req: Request, res: Response) => {
    res.json({
      message: 'Admin panel access granted',
      user: req.user
    });
  }
);

// Student only route
router.get('/student-portal',
  authenticateToken,
  authorizeRoles('STUDENT'),
  (req: Request, res: Response) => {
    res.json({
      message: 'Student portal access granted',
      user: req.user
    });
  }
);

export default router;