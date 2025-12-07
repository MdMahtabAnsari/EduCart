-- AlterEnum
ALTER TYPE "InstructorStatus" ADD VALUE 'REMOVED';

-- CreateTable
CREATE TABLE "OrderItem_InstructorShare" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "shareAmount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "OrderItem_InstructorShare_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItem_InstructorShare" ADD CONSTRAINT "OrderItem_InstructorShare_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem_InstructorShare" ADD CONSTRAINT "OrderItem_InstructorShare_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "CourseInstructor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
