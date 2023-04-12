-- CreateEnum
CREATE TYPE "Authority" AS ENUM ('BASIC', 'ADMIN', 'USER');

-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "authority" "Authority"[] DEFAULT ARRAY['BASIC']::"Authority"[];
