-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Simulation" (
    "id" TEXT NOT NULL,
    "averageConsumption" DOUBLE PRECISION NOT NULL,
    "systemPower" DOUBLE PRECISION NOT NULL,
    "panels" INTEGER NOT NULL,
    "roofArea" DOUBLE PRECISION NOT NULL,
    "estimatedGeneration" DOUBLE PRECISION NOT NULL,
    "monthlySavings" DOUBLE PRECISION NOT NULL,
    "coverage" DOUBLE PRECISION NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Simulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "kitPrice" DOUBLE PRECISION NOT NULL,
    "projectPrice" DOUBLE PRECISION NOT NULL,
    "installationPrice" DOUBLE PRECISION NOT NULL,
    "totalInvestment" DOUBLE PRECISION NOT NULL,
    "paybackYears" DOUBLE PRECISION NOT NULL,
    "pdfUrl" TEXT,
    "simulationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_simulationId_key" ON "Proposal"("simulationId");

-- AddForeignKey
ALTER TABLE "Simulation" ADD CONSTRAINT "Simulation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "Simulation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
