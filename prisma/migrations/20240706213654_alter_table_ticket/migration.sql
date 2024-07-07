/*
  Warnings:

  - You are about to drop the column `priceId` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `stockId` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the `ticket_prices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ticket_stocks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_priceId_fkey";

-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_stockId_fkey";

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "priceId",
DROP COLUMN "stockId",
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'BRL',
ADD COLUMN     "priceValue" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stockAvailable" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stockTotal" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stockType" "TicketStockType" NOT NULL DEFAULT 'UNLIMITED';

-- DropTable
DROP TABLE "ticket_prices";

-- DropTable
DROP TABLE "ticket_stocks";
