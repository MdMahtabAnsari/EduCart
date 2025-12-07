/*
  Warnings:

  - You are about to drop the column `name` on the `Language` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Language_name_key";

-- AlterTable
ALTER TABLE "Language" DROP COLUMN "name";
