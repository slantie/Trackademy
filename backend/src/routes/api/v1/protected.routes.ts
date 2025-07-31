/**
 * @file src/routes/v1/index.ts
 * @description Main router for API version 1. Combines all v1 routes.
 */

import { Router, Request, Response } from "express";
import authRoutes from "./auth.routes";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

// --- API Health Check ---
router.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        status: "success",
        message: "Trackademy API is up and running!",
        timestamp: new Date().toISOString(),
    });
});

// --- Mount Routers ---
// All authentication-related routes are mounted under the /auth prefix.
router.use("/auth", authRoutes);

// --- Example Protected Routes ---
// You can add other resource routes here.

// Example route accessible only by authenticated FACULTY members.
router.get(
    "/faculty-data",
    authenticate,
    authorize(Role.FACULTY, Role.ADMIN),
    (req: Request, res: Response) => {
        res.json({
            status: "success",
            message: "Welcome to the faculty-only area.",
            user: req.user,
        });
    }
);

// Example route accessible only by authenticated ADMINS.
router.get(
    "/admin-report",
    authenticate,
    authorize(Role.ADMIN),
    (req: Request, res: Response) => {
        res.json({
            status: "success",
            message: "Here is your admin-level report.",
            user: req.user,
        });
    }
);

export default router;
