import { Router } from "express";
import { CertificateController } from "../../../controllers/certificate.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { uploadSingle } from "../../../middlewares/upload.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * @route   POST /api/v1/certificates
 * @desc    Create a new certificate
 * @access  Students only
 */
router.post(
  "/",
  authorize(Role.STUDENT),
  CertificateController.createCertificate
);

/**
 * @route   POST /api/v1/certificates/upload
 * @desc    Create a new certificate with file upload
 * @access  Students only
 */
router.post(
  "/upload",
  authorize(Role.STUDENT),
  uploadSingle("certificate"),
  CertificateController.createCertificateWithFile
);

/**
 * @route   GET /api/v1/certificates/me
 * @desc    Get all certificates for the authenticated student
 * @access  Students only
 */
router.get(
  "/me",
  authorize(Role.STUDENT),
  CertificateController.getMyCertificates
);

/**
 * @route   GET /api/v1/certificates/stats
 * @desc    Get certificate statistics
 * @access  Faculty & Admin only
 */
router.get(
  "/stats",
  authorize(Role.FACULTY, Role.ADMIN),
  CertificateController.getCertificateStats
);

/**
 * @route   GET /api/v1/certificates/student/:studentId
 * @desc    Get all certificates for a specific student
 * @access  Faculty & Admin only
 */
router.get(
  "/student/:studentId",
  authorize(Role.FACULTY, Role.ADMIN),
  CertificateController.getStudentCertificates
);

/**
 * @route   GET /api/v1/certificates/:id
 * @desc    Get a single certificate by ID
 * @access  Owner (Student), Faculty, & Admin
 */
router.get(
  "/:id",
  authorize(Role.STUDENT, Role.FACULTY, Role.ADMIN),
  CertificateController.getCertificateById
);

/**
 * @route   PATCH /api/v1/certificates/:id
 * @desc    Update a certificate
 * @access  Owner (Student) only
 */
router.patch(
  "/:id",
  authorize(Role.STUDENT),
  CertificateController.updateCertificate
);

/**
 * @route   DELETE /api/v1/certificates/:id
 * @desc    Soft-delete a certificate
 * @access  Owner (Student) only
 */
router.delete(
  "/:id",
  authorize(Role.STUDENT),
  CertificateController.deleteCertificate
);

export default router;
