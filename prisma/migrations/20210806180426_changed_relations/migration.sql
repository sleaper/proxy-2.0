/*
  Warnings:

  - You are about to drop the column `userId` on the `Homeworks` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Marks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[firebaseToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userFireToken` to the `Homeworks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userFireToken` to the `Marks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Homeworks" DROP CONSTRAINT "Homeworks_userId_fkey";

-- DropForeignKey
ALTER TABLE "Marks" DROP CONSTRAINT "Marks_userId_fkey";

-- AlterTable
ALTER TABLE "Homeworks" DROP COLUMN "userId",
ADD COLUMN     "userFireToken" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Marks" DROP COLUMN "userId",
ADD COLUMN     "userFireToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User.firebaseToken_unique" ON "User"("firebaseToken");

-- AddForeignKey
ALTER TABLE "Homeworks" ADD FOREIGN KEY ("userFireToken") REFERENCES "User"("firebaseToken") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marks" ADD FOREIGN KEY ("userFireToken") REFERENCES "User"("firebaseToken") ON DELETE CASCADE ON UPDATE CASCADE;
