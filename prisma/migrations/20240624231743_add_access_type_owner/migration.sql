-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('DIGITAL', 'PRESENCIAL', 'HYBRID');

-- AlterTable
ALTER TABLE "owners" ADD COLUMN     "accessType" "AccessType" NOT NULL DEFAULT 'DIGITAL';
