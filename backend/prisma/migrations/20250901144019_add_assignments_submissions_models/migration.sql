-- CreateEnum
CREATE TYPE "public"."SubmissionStatus" AS ENUM ('SUBMITTED', 'GRADED', 'PENDING_REVIEW');

-- CreateTable
CREATE TABLE "public"."assignments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "totalMarks" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."submissions" (
    "id" TEXT NOT NULL,
    "content" TEXT,
    "filePath" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "marksAwarded" INTEGER,
    "feedback" TEXT,
    "status" "public"."SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "gradedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "assignments_courseId_idx" ON "public"."assignments"("courseId");

-- CreateIndex
CREATE INDEX "assignments_dueDate_idx" ON "public"."assignments"("dueDate");

-- CreateIndex
CREATE INDEX "submissions_assignmentId_idx" ON "public"."submissions"("assignmentId");

-- CreateIndex
CREATE INDEX "submissions_studentId_idx" ON "public"."submissions"("studentId");

-- CreateIndex
CREATE INDEX "submissions_status_idx" ON "public"."submissions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_assignmentId_studentId_key" ON "public"."submissions"("assignmentId", "studentId");
