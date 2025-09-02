import { z } from "zod";
import { InternshipStatus } from "@prisma/client";

// Schema for creating a new internship
export const createInternshipSchema = z.object({
  body: z
    .object({
      companyName: z
        .string()
        .min(1, "Company name is required")
        .max(100, "Company name must be less than 100 characters"),

      role: z
        .string()
        .min(1, "Role is required")
        .max(100, "Role must be less than 100 characters"),

      description: z
        .string()
        .max(1000, "Description must be less than 1000 characters")
        .optional(),

      startDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), "Invalid start date format")
        .transform((date) => new Date(date)),

      endDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), "Invalid end date format")
        .transform((date) => new Date(date))
        .optional(),

      status: z
        .enum([
          InternshipStatus.APPLIED,
          InternshipStatus.ONGOING,
          InternshipStatus.COMPLETED,
          InternshipStatus.CANCELLED,
        ])
        .default(InternshipStatus.APPLIED),

      stipend: z
        .number()
        .min(0, "Stipend cannot be negative")
        .max(1000000, "Stipend seems unreasonably high")
        .optional(),

      location: z
        .string()
        .max(100, "Location must be less than 100 characters")
        .optional(),

      offerLetterPath: z
        .string()
        .url("Offer letter path must be a valid URL")
        .optional(),
    })
    .refine(
      (data) => {
        // If both dates are provided, ensure endDate is after startDate
        if (data.endDate) {
          return data.endDate > data.startDate;
        }
        return true;
      },
      {
        message: "End date must be after start date",
        path: ["endDate"],
      }
    ),
});

// Schema for updating an existing internship
export const updateInternshipSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Internship ID is required"),
  }),
  body: z
    .object({
      companyName: z
        .string()
        .min(1, "Company name is required")
        .max(100, "Company name must be less than 100 characters")
        .optional(),

      role: z
        .string()
        .min(1, "Role is required")
        .max(100, "Role must be less than 100 characters")
        .optional(),

      description: z
        .string()
        .max(1000, "Description must be less than 1000 characters")
        .optional(),

      startDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), "Invalid start date format")
        .transform((date) => new Date(date))
        .optional(),

      endDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), "Invalid end date format")
        .transform((date) => new Date(date))
        .optional(),

      status: z
        .enum([
          InternshipStatus.APPLIED,
          InternshipStatus.ONGOING,
          InternshipStatus.COMPLETED,
          InternshipStatus.CANCELLED,
        ])
        .optional(),

      stipend: z
        .number()
        .min(0, "Stipend cannot be negative")
        .max(1000000, "Stipend seems unreasonably high")
        .optional(),

      location: z
        .string()
        .max(100, "Location must be less than 100 characters")
        .optional(),

      offerLetterPath: z
        .string()
        .url("Offer letter path must be a valid URL")
        .optional(),

      nocPath: z.string().url("NoC path must be a valid URL").optional(),

      completionCertificatePath: z
        .string()
        .url("Completion certificate path must be a valid URL")
        .optional(),
    })
    .refine(
      (data) => {
        // If both dates are provided, ensure endDate is after startDate
        if (data.endDate && data.startDate) {
          return data.endDate > data.startDate;
        }
        return true;
      },
      {
        message: "End date must be after start date",
        path: ["endDate"],
      }
    ),
});

// Schema for query parameters when getting internships
export const getInternshipsQuerySchema = z.object({
  query: z.object({
    status: z
      .enum([
        InternshipStatus.APPLIED,
        InternshipStatus.ONGOING,
        InternshipStatus.COMPLETED,
        InternshipStatus.CANCELLED,
      ])
      .optional(),

    startYear: z
      .string()
      .regex(/^\d{4}$/, "Start year must be a 4-digit year")
      .transform((year) => parseInt(year))
      .optional(),

    limit: z
      .string()
      .optional()
      .default("10")
      .transform((limit) => parseInt(limit))
      .refine((limit) => limit <= 100, "Limit cannot exceed 100"),

    offset: z
      .string()
      .optional()
      .default("0")
      .transform((offset) => parseInt(offset)),
  }),
});

// Schema for student ID parameter
export const studentIdParamSchema = z.object({
  params: z.object({
    studentId: z.string().min(1, "Student ID is required"),
  }),
});

// Schema for internship ID parameter
export const internshipIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Internship ID is required"),
  }),
});

// Type exports for use in controllers
export type CreateInternshipInput = z.infer<
  typeof createInternshipSchema
>["body"];
export type UpdateInternshipInput = z.infer<
  typeof updateInternshipSchema
>["body"];
export type GetInternshipsQuery = z.infer<
  typeof getInternshipsQuerySchema
>["query"];
export type StudentIdParam = z.infer<typeof studentIdParamSchema>["params"];
export type InternshipIdParam = z.infer<
  typeof internshipIdParamSchema
>["params"];
