-- CreateEnum
CREATE TYPE "InstructorPermission" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "InstructorRole" AS ENUM ('OWNER', 'CO_INSTRUCTOR');

-- CreateEnum
CREATE TYPE "InstructorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "CourseInstructor" ADD COLUMN     "permissions" "InstructorPermission"[],
ADD COLUMN     "role" "InstructorRole" NOT NULL DEFAULT 'CO_INSTRUCTOR',
ADD COLUMN     "share" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "status" "InstructorStatus" NOT NULL DEFAULT 'PENDING';
