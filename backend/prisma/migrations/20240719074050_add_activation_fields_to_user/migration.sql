-- AlterTable
ALTER TABLE "events" ADD COLUMN     "activationCode" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
