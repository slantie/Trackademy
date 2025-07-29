/**
 * @file src/controllers/database.controller.ts
 * @description Controller for handling administrative database API requests.
 */

import { Request, Response, NextFunction } from "express";
import { databaseService } from "../services/database.service";

export class DatabaseController {
    static async cleanDatabase(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await databaseService.cleanDatabase();
            res.status(200).json({
                status: "success",
                message:
                    "Database cleaned successfully. All data except users has been deleted.",
            });
        } catch (error) {
            next(error);
        }
    }
}
