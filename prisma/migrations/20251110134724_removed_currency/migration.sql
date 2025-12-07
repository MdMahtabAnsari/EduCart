/*
  Warnings:

  - You are about to drop the column `currency` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `orderItemId` to the `Refund` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "currency",
DROP COLUMN "language";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "currency";

-- AlterTable
ALTER TABLE "Refund" ADD COLUMN     "orderItemId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Currency";

-- DropEnum
DROP TYPE "Language";

-- CreateTable
CREATE TABLE "CourseLanguage" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "CourseLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseLanguage_courseId_languageId_key" ON "CourseLanguage"("courseId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- AddForeignKey
ALTER TABLE "CourseLanguage" ADD CONSTRAINT "CourseLanguage_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseLanguage" ADD CONSTRAINT "CourseLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
