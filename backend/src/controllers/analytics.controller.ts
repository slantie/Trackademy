/**
 * @file src/controllers/analytics.controller.ts
 * @description Controller for handling analytics-related API requests.
 */

import { Request, Response, NextFunction } from "express";
import { analyticsService } from "../services/analytics.service";
import { ResultsAnalyticsQueryOptions } from "../services/analytics.service";

export class AnalyticsController {
  /**
   * Handles the request to get analytics for exam results.
   * It takes optional query parameters for filtering and passes them to the analytics service.
   */
  static async getResultsAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // The query parameters are already validated by the Zod middleware
      const options: ResultsAnalyticsQueryOptions = req.query;

      const statistics = await analyticsService.getResultsAnalytics(options);

      res.status(200).json({
        status: "success",
        message: "Result analytics retrieved successfully.",
        data: {
          statistics,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
