/*
  Warnings:

  - You are about to drop the column `orderItemId` on the `cart_users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- DropForeignKey
ALTER TABLE "cart_users" DROP CONSTRAINT "cart_users_orderItemId_fkey";

-- AlterTable
ALTER TABLE "cart_users" DROP COLUMN "orderItemId";

-- AlterTable
ALTER TABLE "carts" ADD COLUMN     "statusCart" "CartStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "order_item_users" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "infoExtra" JSONB NOT NULL,

    CONSTRAINT "order_item_users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_item_users" ADD CONSTRAINT "order_item_users_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
