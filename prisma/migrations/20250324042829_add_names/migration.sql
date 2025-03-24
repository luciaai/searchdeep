-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "firstName" TEXT,
                   ADD COLUMN IF NOT EXISTS "lastName" TEXT;
