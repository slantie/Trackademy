-- CreateEnum
CREATE TYPE "public"."InternshipStatus" AS ENUM ('APPLIED', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."internships" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "status" "public"."InternshipStatus" NOT NULL DEFAULT 'APPLIED',
    "stipend" DOUBLE PRECISION,
    "location" TEXT,
    "offerLetterPath" TEXT,
    "nocPath" TEXT,
    "completionCertificatePath" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "internships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "internships_studentId_idx" ON "public"."internships"("studentId");

-- CreateIndex
CREATE INDEX "internships_status_idx" ON "public"."internships"("status");

-- CreateIndex
CREATE INDEX "internships_startDate_idx" ON "public"."internships"("startDate");
