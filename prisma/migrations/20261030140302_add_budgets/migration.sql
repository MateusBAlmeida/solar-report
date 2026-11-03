/*
  Warnings:

  - Added the required column `updatedAt` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Proposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `connectionType` to the `Simulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consumptions` to the `Simulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyGeneration` to the `Simulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tariff` to the `Simulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Simulation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "descriptionInversor" TEXT,
ADD COLUMN     "descriptionPlacas" TEXT,
ADD COLUMN     "inversor" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Simulation" ADD COLUMN     "connectionType" TEXT NOT NULL,
ADD COLUMN     "consumptions" JSONB NOT NULL,
ADD COLUMN     "monthlyGeneration" JSONB NOT NULL,
ADD COLUMN     "tariff" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyCnpj" TEXT,
    "companyAddress" TEXT,
    "companyPhone" TEXT,
    "companyEmail" TEXT,
    "clientName" TEXT NOT NULL,
    "projectTitle" TEXT NOT NULL,
    "activitiesDescription" TEXT,
    "observations" TEXT,
    "paymentConditions" TEXT,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetItem" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "budgetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BudgetItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Budget_number_key" ON "Budget"("number");

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
