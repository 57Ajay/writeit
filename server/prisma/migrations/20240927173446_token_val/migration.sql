/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `value` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "value" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Token_value_key" ON "Token"("value");
