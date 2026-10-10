-- AlterTable
ALTER TABLE "ContactSubmission" ADD COLUMN     "emailError" TEXT,
ADD COLUMN     "emailed" BOOLEAN NOT NULL DEFAULT false;
