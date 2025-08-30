import { Request, Response, NextFunction } from "express";
import { dashboardService } from "../services/dashboard.service";

export class DashboardController {
    static async getSummary(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const counts = await dashboardService.getCounts();
            res.status(200).json({
                status: "success",
                message: "Dashboard summary retrieved successfully",
                data: counts,
            });
        } catch (error) {
            next(error);
        }
    }
}
