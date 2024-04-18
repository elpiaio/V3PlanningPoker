/*
  Warnings:

  - You are about to drop the column `voting` on the `Story` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "storyActive" INTEGER;

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "voting";
