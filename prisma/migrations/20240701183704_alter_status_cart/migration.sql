/*
  Warnings:

  - The values [ACTIVE,CLOSED] on the enum `CartStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CartStatus_new" AS ENUM ('OPEN', 'CHECKED_OUT');
ALTER TABLE "carts" ALTER COLUMN "statusCart" DROP DEFAULT;
ALTER TABLE "carts" ALTER COLUMN "statusCart" TYPE "CartStatus_new" USING ("statusCart"::text::"CartStatus_new");
ALTER TYPE "CartStatus" RENAME TO "CartStatus_old";
ALTER TYPE "CartStatus_new" RENAME TO "CartStatus";
DROP TYPE "CartStatus_old";
ALTER TABLE "carts" ALTER COLUMN "statusCart" SET DEFAULT 'OPEN';
COMMIT;

-- AlterTable
ALTER TABLE "carts" ALTER COLUMN "statusCart" SET DEFAULT 'OPEN';
