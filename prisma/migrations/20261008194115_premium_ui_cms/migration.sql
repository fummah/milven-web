/*
  Warnings:

  - Added the required column `updatedAt` to the `ContactSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContactSubmission" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Insight" ADD COLUMN     "author" TEXT,
ADD COLUMN     "authorRole" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "readMinutes" INTEGER;

-- AlterTable
ALTER TABLE "MediaAsset" ADD COLUMN     "folder" TEXT NOT NULL DEFAULT 'uploads',
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "mime" TEXT,
ADD COLUMN     "size" INTEGER,
ADD COLUMN     "width" INTEGER;

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);
