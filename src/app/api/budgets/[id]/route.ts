import { NextResponse } from "next/server";
import {
  deleteBudget,
  getBudgetById,
} from "@/services/budget.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const budget = await getBudgetById(id);

    if (!budget) {
      return NextResponse.json(
        { error: "Orçamento não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(budget);
  } catch (error) {
    console.error("Erro ao buscar orçamento:", error);

    return NextResponse.json(
      { error: "Não foi possível carregar o orçamento." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    await deleteBudget(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir orçamento:", error);

    return NextResponse.json(
      { error: "Não foi possível excluir o orçamento." },
      { status: 500 }
    );
  }
}