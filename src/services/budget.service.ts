
import { prisma } from "@/lib/prisma";

type BudgetItemInput = {
  description: string;
  quantity: number;
  unitPrice: number;
};

type CreateBudgetInput = {
  companyName: string;
  companyCnpj?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;

  clientName: string;
  projectTitle: string;

  activitiesDescription?: string;
  observations?: string;
  paymentConditions?: string;

  items: BudgetItemInput[];
};

async function generateBudgetNumber() {
  const year = new Date().getFullYear();

  const count = await prisma.budget.count({
    where: {
      number: {
        startsWith: `ORC-${year}-`,
      },
    },
  });

  return `ORC-${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function createBudget(data: CreateBudgetInput) {
  const number = await generateBudgetNumber();

  const items = data.items.map((item, index) => ({
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.quantity * item.unitPrice,
    position: index,
  }));

  const total = items.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  return prisma.budget.create({
    data: {
      number,
      ...data,
      total,
      items: {
        create: items,
      },
    },
    include: {
      items: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });
}

export async function getBudgets() {
  return prisma.budget.findMany({
    include: {
      items: {
        orderBy: {
          position: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getBudgetById(id: string) {
  return prisma.budget.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });
}

export async function deleteBudget(id: string) {
  return prisma.budget.delete({
    where: { id },
  });
}
