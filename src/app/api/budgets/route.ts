import { NextResponse } from "next/server";
import { createBudget, getBudgets } from "@/services/budget.service";

export async function GET() {
  try {
    const budgets = await getBudgets();
    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Erro ao listar orçamentos:", error);

    return NextResponse.json(
      { error: "Não foi possível listar os orçamentos." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.clientName ||
      !body.projectTitle ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        { error: "Informe cliente, projeto e pelo menos um item." },
        { status: 400 }
      );
    }

    const itemsAreValid = body.items.every(
      (item: {
        description?: string;
        quantity?: number;
        unitPrice?: number;
      }) =>
        typeof item.description === "string" &&
        item.description.trim().length > 0 &&
        Number.isFinite(Number(item.quantity)) &&
        Number(item.quantity) > 0 &&
        Number.isFinite(Number(item.unitPrice)) &&
        Number(item.unitPrice) >= 0
    );

    if (!itemsAreValid) {
      return NextResponse.json(
        { error: "Verifique as descrições, quantidades e preços dos itens." },
        { status: 400 }
      );
    }

    const budget = await createBudget({
      companyName: body.companyName,
      companyCnpj: body.companyCnpj,
      companyAddress: body.companyAddress,
      companyPhone: body.companyPhone,
      companyEmail: body.companyEmail,
      clientName: body.clientName.trim(),
      projectTitle: body.projectTitle.trim(),
      activitiesDescription: body.activitiesDescription,
      observations: body.observations,
      paymentConditions: body.paymentConditions,
      items: body.items.map(
        (item: {
          description: string;
          quantity: number;
          unitPrice: number;
        }) => ({
          description: item.description.trim(),
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })
      ),
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar orçamento:", error);

    return NextResponse.json(
      { error: "Não foi possível salvar o orçamento." },
      { status: 500 }
    );
  }
}