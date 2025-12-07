/*
  Warnings:

  - You are about to drop the `OrderItem_InstructorShare` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderItem_InstructorShare" DROP CONSTRAINT "OrderItem_InstructorShare_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem_InstructorShare" DROP CONSTRAINT "OrderItem_InstructorShare_orderItemId_fkey";

-- DropTable
DROP TABLE "OrderItem_InstructorShare";

-- CreateTable
CREATE TABLE "OrderItemInstructorShare" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "shareAmount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "OrderItemInstructorShare_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItemInstructorShare" ADD CONSTRAINT "OrderItemInstructorShare_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItemInstructorShare" ADD CONSTRAINT "OrderItemInstructorShare_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "CourseInstructor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
