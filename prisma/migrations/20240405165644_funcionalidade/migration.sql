-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "Refresh" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showResults" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showVotes" BOOLEAN NOT NULL DEFAULT false;