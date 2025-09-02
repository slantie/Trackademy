import { z } from "zod";

/**
 * Base validation schema for certificate data
 */
const baseCertificateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must not exceed 200 characters")
    .trim(),

  issuingOrganization: z
    .string()
    .min(1, "Issuing organization is required")
    .min(2, "Issuing organization must be at least 2 characters")
    .max(150, "Issuing organization must not exceed 150 characters")
    .trim(),

  issueDate: z
    .string()
    .min(1, "Issue date is required")
    .refine(
      (date) => {
        const parsed = new Date(date);
        return !isNaN(parsed.getTime());
      },
      { message: "Issue date must be a valid date" }
    )
    .refine(
      (date) => {
        const parsed = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        return parsed <= today;
      },
      { message: "Issue date cannot be in the future" }
    ),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .trim()
    .optional(),

  certificatePath: z
    .string()
    .min(1, "Certificate file path is required")
    .url("Certificate path must be a valid URL")
    .refine(
      (url) => {
        // Check if URL is from a trusted source (Cloudinary, etc.)
        const trustedDomains = [
          "cloudinary.com",
          "res.cloudinary.com",
          "drive.google.com",
          "dropbox.com",
          "amazonaws.com",
        ];

        try {
          const urlObj = new URL(url);
          return trustedDomains.some((domain) =>
            urlObj.hostname.includes(domain)
          );
        } catch {
          return false;
        }
      },
      {
        message:
          "Certificate must be uploaded to a trusted file hosting service",
      }
    ),
});

/**
 * Validation schema for creating a new certificate
 */
export const createCertificateSchema = z.object({
  body: baseCertificateSchema,
});

/**
 * Validation schema for updating a certificate
 */
export const updateCertificateSchema = z.object({
  body: baseCertificateSchema.partial(),
});

/**
 * Validation schema for certificate ID parameter
 */
export const certificateIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Certificate ID is required"),
  }),
});

/**
 * Validation schema for student ID parameter
 */
export const studentIdParamSchema = z.object({
  studentId: z
    .string()
    .min(1, "Student ID is required")
    .refine(
      (id) => {
        // CUID format validation (basic check)
        return /^c[a-z0-9]{24}$/.test(id);
      },
      { message: "Invalid student ID format" }
    ),
});

/**
 * Validation schema for query parameters when getting certificates
 */
export const getCertificatesQuerySchema = z
  .object({
    page: z
      .string()
      .regex(/^\d+$/, "Page must be a positive number")
      .transform(Number)
      .refine((n) => n > 0, "Page must be greater than 0")
      .optional()
      .default(1),

    limit: z
      .string()
      .regex(/^\d+$/, "Limit must be a positive number")
      .transform(Number)
      .refine((n) => n > 0 && n <= 100, "Limit must be between 1 and 100")
      .optional()
      .default(10),

    search: z
      .string()
      .max(100, "Search term must not exceed 100 characters")
      .trim()
      .optional(),

    issuingOrganization: z
      .string()
      .max(150, "Issuing organization filter must not exceed 150 characters")
      .trim()
      .optional(),

    fromDate: z
      .string()
      .refine(
        (date) => {
          if (!date) return true;
          const parsed = new Date(date);
          return !isNaN(parsed.getTime());
        },
        { message: "From date must be a valid date" }
      )
      .transform((date) => (date ? new Date(date) : undefined))
      .optional(),

    toDate: z
      .string()
      .refine(
        (date) => {
          if (!date) return true;
          const parsed = new Date(date);
          return !isNaN(parsed.getTime());
        },
        { message: "To date must be a valid date" }
      )
      .transform((date) => (date ? new Date(date) : undefined))
      .optional(),
  })
  .refine(
    (data) => {
      if (data.fromDate && data.toDate) {
        return data.fromDate <= data.toDate;
      }
      return true;
    },
    {
      message: "From date must be before or equal to to date",
      path: ["fromDate"],
    }
  );

// Type exports for use in controllers and services
export type CreateCertificateInput = z.infer<typeof createCertificateSchema>;
export type UpdateCertificateInput = z.infer<typeof updateCertificateSchema>;
export type CertificateIdParam = z.infer<typeof certificateIdParamSchema>;
export type StudentIdParam = z.infer<typeof studentIdParamSchema>;
export type GetCertificatesQuery = z.infer<typeof getCertificatesQuerySchema>;
