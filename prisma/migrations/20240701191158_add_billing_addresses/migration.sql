/*
  Warnings:

  - You are about to drop the column `ticketId` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `ticketId` on the `order_items` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `cart_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "ticketId",
ADD COLUMN     "itemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "ticketId",
ADD COLUMN     "itemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "order_billing_addresses" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT,
    "complement" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "country" TEXT DEFAULT 'BR',
    "zipCode" TEXT NOT NULL,

    CONSTRAINT "order_billing_addresses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_billing_addresses" ADD CONSTRAINT "order_billing_addresses_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
