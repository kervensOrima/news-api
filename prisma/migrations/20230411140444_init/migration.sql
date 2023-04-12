/*
  Warnings:

  - You are about to drop the column `usernam` on the `Author` table. All the data in the column will be lost.
  - Added the required column `username` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Author" DROP COLUMN "usernam",
ADD COLUMN     "username" VARCHAR(50) NOT NULL;
