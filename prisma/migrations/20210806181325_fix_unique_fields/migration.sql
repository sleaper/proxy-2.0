/*
  Warnings:

  - A unique constraint covering the columns `[userFireToken]` on the table `Homeworks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userFireToken]` on the table `Marks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Homeworks.userFireToken_unique" ON "Homeworks"("userFireToken");

-- CreateIndex
CREATE UNIQUE INDEX "Marks.userFireToken_unique" ON "Marks"("userFireToken");
