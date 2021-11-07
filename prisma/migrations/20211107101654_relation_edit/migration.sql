/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Homeworks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Marks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Homeworks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Marks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Homeworks" DROP CONSTRAINT "Homeworks_userFireToken_fkey";

-- DropForeignKey
ALTER TABLE "Marks" DROP CONSTRAINT "Marks_userFireToken_fkey";

-- AlterTable
ALTER TABLE "Homeworks" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Marks" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Homeworks.userId_unique" ON "Homeworks"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Marks.userId_unique" ON "Marks"("userId");

-- AddForeignKey
ALTER TABLE "Homeworks" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marks" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
