/*
  Warnings:

  - You are about to drop the column `createdAt` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `cartId` on the `cart_users` table. All the data in the column will be lost.
  - You are about to drop the column `cartItemId` on the `cart_users` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `cart_users` table. All the data in the column will be lost.
  - You are about to drop the column `infoExta` on the `cart_users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `cart_users` table. All the data in the column will be lost.
  - You are about to drop the column `cartMarketingId` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `customer_email` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `customer_name` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the `cart_marketings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `infoExtra` to the `cart_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `cart_users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cart_users" DROP CONSTRAINT "cart_users_cartItemId_fkey";

-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_cartMarketingId_fkey";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "cart_users" DROP COLUMN "cartId",
DROP COLUMN "cartItemId",
DROP COLUMN "createdAt",
DROP COLUMN "infoExta",
DROP COLUMN "updatedAt",
ADD COLUMN     "infoExtra" JSONB NOT NULL,
ADD COLUMN     "itemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "carts" DROP COLUMN "cartMarketingId",
DROP COLUMN "customer_email",
DROP COLUMN "customer_name",
ADD COLUMN     "customerEmail" TEXT,
ADD COLUMN     "customerName" TEXT;

-- DropTable
DROP TABLE "cart_marketings";

-- CreateTable
CREATE TABLE "marketing_data" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "utmMedium" TEXT,
    "utmSource" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,

    CONSTRAINT "marketing_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "marketing_data_cartId_key" ON "marketing_data"("cartId");

-- AddForeignKey
ALTER TABLE "cart_users" ADD CONSTRAINT "cart_users_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "cart_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_data" ADD CONSTRAINT "marketing_data_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
