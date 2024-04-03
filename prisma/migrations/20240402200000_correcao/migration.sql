/*
  Warnings:

  - You are about to drop the column `admin` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `IsAdmin` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "admin";

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "finishAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "IsAdmin";
