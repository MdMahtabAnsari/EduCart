/*
  Warnings:

  - You are about to drop the column `paymentProvider` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `providerPaymentId` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `amount` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Payment_orderId_key";

-- DropIndex
DROP INDEX "Payment_providerPaymentId_paymentProvider_key";

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "paymentProvider",
DROP COLUMN "providerPaymentId";

-- CreateTable
CREATE TABLE "ProviderPayment" (
    "id" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "providerPaymentId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProviderPayment_paymentId_key" ON "ProviderPayment"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderPayment_provider_providerPaymentId_key" ON "ProviderPayment"("provider", "providerPaymentId");

-- AddForeignKey
ALTER TABLE "ProviderPayment" ADD CONSTRAINT "ProviderPayment_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
