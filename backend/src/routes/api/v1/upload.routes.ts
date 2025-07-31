/**
 * @file src/routes/api/v1/upload.routes.ts
 * @description Defines API routes for bulk data uploads.
 */

import { Router } from "express";
import multer from "multer";
import { UploadController } from "../../../controllers/upload.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import {
    facultyMatrixBodySchema,
    resultsUploadBodySchema,
} from "../../../validations/upload.validation";
import { Role } from "@prisma/client";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate, authorize(Role.ADMIN));

router.post(
    "/faculty",
    upload.single("file"),
    UploadController.uploadFacultyData
);

router.post(
    "/students",
    upload.single("file"),
    UploadController.uploadStudentData
);

router.post(
    "/subjects",
    upload.single("file"),
    UploadController.uploadSubjectData
);

router.post(
    "/faculty-matrix",
    upload.single("file"),
    validate(facultyMatrixBodySchema),
    UploadController.uploadFacultyMatrix
);

router.post(
    "/results",
    upload.single("file"),
    validate(resultsUploadBodySchema),
    UploadController.uploadResultsData
);

export default router;
