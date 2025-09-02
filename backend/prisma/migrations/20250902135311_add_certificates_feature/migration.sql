-- CreateTable
CREATE TABLE "public"."certificates" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issuingOrganization" TEXT NOT NULL,
    "issueDate" DATE NOT NULL,
    "description" TEXT,
    "certificatePath" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "certificates_studentId_idx" ON "public"."certificates"("studentId");

-- CreateIndex
CREATE INDEX "certificates_issueDate_idx" ON "public"."certificates"("issueDate");
