-- CreateEnum
CREATE TYPE "TicketSalesStatus" AS ENUM ('AVAILABLE', 'SOLD_OUT', 'PAUSED');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('BRL', 'USD', 'EUR');

-- CreateEnum
CREATE TYPE "TicketStockType" AS ENUM ('UNLIMITED', 'LIMITED');

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "accessType" "AccessType" NOT NULL DEFAULT 'DIGITAL',
    "saleStatus" "TicketSalesStatus" NOT NULL DEFAULT 'AVAILABLE',
    "usedQuantity" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL DEFAULT 0,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "priceId" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_prices" (
    "id" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL DEFAULT 'BRL',

    CONSTRAINT "ticket_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_stocks" (
    "id" TEXT NOT NULL,
    "total" INTEGER NOT NULL DEFAULT 0,
    "available" INTEGER NOT NULL DEFAULT 0,
    "type" "TicketStockType" NOT NULL DEFAULT 'UNLIMITED',

    CONSTRAINT "ticket_stocks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "ticket_prices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "ticket_stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
