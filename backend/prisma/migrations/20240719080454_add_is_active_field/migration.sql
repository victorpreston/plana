/*
  Warnings:

  - You are about to drop the column `activationCode` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "activationCode",
DROP COLUMN "isActive";
