-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'INTEGER');

-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('AVAILABLE', 'PAUSED');

-- CreateEnum
CREATE TYPE "AvailabilityType" AS ENUM ('UNLIMITED', 'LIMITED');

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "description" TEXT,
    "statusCoupon" "CouponStatus" NOT NULL DEFAULT 'AVAILABLE',
    "enforceInTickets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "discountType" "DiscountType" NOT NULL,
    "discountValue" INTEGER NOT NULL,
    "availabilityType" "AvailabilityType" NOT NULL,
    "availabilityTotal" INTEGER,
    "availabilityQty" INTEGER,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);
