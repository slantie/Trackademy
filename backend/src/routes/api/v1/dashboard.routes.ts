import { Router } from "express";
import { DashboardController } from "../../../controllers/dashboard.controller";
import { authenticate } from "../../../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/summary", DashboardController.getSummary);

export default router;
