-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "total_amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_discount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_items" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_tax" INTEGER NOT NULL DEFAULT 0;
