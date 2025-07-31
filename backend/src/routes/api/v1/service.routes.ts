/**
 * @file src/api/v1/routes/service/service.routes.ts
 * @description Service-only routes for internal service-to-service communication
 * These routes use API key authentication instead of JWT tokens
 */

import { Router } from "express";
import { serviceAuthMiddleware } from "../../../middlewares/serviceAuth.middleware";

const router = Router();

// Apply service authentication to all routes
router.use(serviceAuthMiddleware);

// FastAPI route for Result Excel Processing
router.post("/process-results", async (req, res) => {
    try {
        // Here you would typically forward the request to the FastAPI service
        // For example, using axios or fetch to call the FastAPI endpoint
        // const response = await axios.post(`${process.env.SERVICE_URL}/api/process-results`, req.body);

        // Simulating a successful response for demonstration purposes
        res.status(200).json({ message: "Results processed successfully" });
    } catch (error) {
        console.error("Error processing results:", error);
        res.status(500).json({ error: "Failed to process results" });
    }
});

// FastAPI route for Result Excel Processing
router.post("/process-faculty-matrix", async (req, res) => {
    try {
        // Here you would typically forward the request to the FastAPI service
        // For example, using axios or fetch to call the FastAPI endpoint
        // const response = await axios.post(`${process.env.SERVICE_URL}/api/process-results`, req.body);

        // Simulating a successful response for demonstration purposes
        res.status(200).json({
            message: "Faculty Matrix processed successfully",
        });
    } catch (error) {
        console.error("Error processing faculty matrix:", error);
        res.status(500).json({ error: "Failed to process faculty matrix" });
    }
});

export default router;
