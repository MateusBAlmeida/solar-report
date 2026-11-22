
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, Printer } from "lucide-react";
import { BudgetPdfDownload } from "@/components/budgets/BudgetPdf";

type BudgetItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  position: number;
};

type Budget = {
  id: string;
  number: string;
  companyName: string;
  companyCnpj: string | null;
  companyAddress: string | null;
  companyPhone: string | null;
  companyEmail: string | null;
  clientName: string;
  projectTitle: string;
  activitiesDescription: string | null;
  observations: string | null;
  paymentConditions: string | null;
  total: number;
  createdAt: string;
  items: BudgetItem[];
};

const currency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const dateFormat = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

export default function BudgetDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBudget() {
      try {
        const response = await fetch(`/api/budgets/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ?? "Não foi possível carregar o orçamento."
          );
        }

        setBudget(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar orçamento."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      void loadBudget();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-muted/30 p-8">
        <div className="mx-auto max-w-4xl text-center text-sm text-muted-foreground">
          Carregando orçamento...
        </div>
      </main>
    );
  }

  if (error || !budget) {
    return (
      <main className="min-h-screen bg-muted/30 p-8">
        <div className="mx-auto max-w-4xl rounded-xl border bg-card p-6">
          <p className="text-sm text-destructive">
            {error || "Orçamento não encontrado."}
          </p>
          <Link
            href="/budgets"
            className="mt-4 inline-flex items-center gap-2 text-sm underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos orçamentos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href="/budgets"
            className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>

          <BudgetPdfDownload budget={budget} />
        </header>

        <article className="rounded-xl border bg-white p-6 text-gray-900 shadow-sm sm:p-10 print:border-0 print:p-0 print:shadow-none">
          <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row">
            <div>
              <h1 className="text-2xl font-bold">{budget.companyName}</h1>
              {budget.companyCnpj && (
                <p className="mt-1 text-sm">CNPJ: {budget.companyCnpj}</p>
              )}
              {budget.companyAddress && (
                <p className="text-sm">{budget.companyAddress}</p>
              )}
              {budget.companyPhone && (
                <p className="text-sm">Tel.: {budget.companyPhone}</p>
              )}
              {budget.companyEmail && (
                <p className="text-sm">{budget.companyEmail}</p>
              )}
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-500">Orçamento</p>
              <p className="text-lg font-semibold">{budget.number}</p>
              <p className="mt-1 text-sm">{dateFormat(budget.createdAt)}</p>
            </div>
          </div>

          <div className="py-6">
            <h2 className="text-xl font-bold">{budget.projectTitle}</h2>
            <p className="mt-2 text-sm">
              <span className="font-semibold">CLIENTE:</span>{" "}
              {budget.clientName}
            </p>
          </div>

          {budget.activitiesDescription && (
            <section className="mb-6">
              <h3 className="mb-2 font-semibold uppercase">
                Descrição das atividades
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-6">
                {budget.activitiesDescription}
              </p>
            </section>
          )}

          <section className="mb-6">
            <h3 className="mb-3 font-semibold uppercase">Preços</h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-y bg-gray-50">
                    <th className="px-3 py-2 text-left font-semibold">
                      Item
                    </th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Quantidade
                    </th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Valor unitário
                    </th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {budget.items
                    .slice()
                    .sort((a, b) => a.position - b.position)
                    .map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="px-3 py-3">{item.description}</td>
                        <td className="px-3 py-3 text-right">
                          {item.quantity}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-right">
                          {currency(item.unitPrice)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-right">
                          {currency(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2">
                    <td
                      colSpan={3}
                      className="px-3 py-3 text-right font-bold"
                    >
                      TOTAL
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-bold">
                      {currency(budget.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {budget.observations && (
            <section className="mb-5">
              <h3 className="mb-2 font-semibold uppercase">Observações</h3>
              <p className="whitespace-pre-wrap text-sm leading-6">
                {budget.observations}
              </p>
            </section>
          )}

          {budget.paymentConditions && (
            <section className="mb-10">
              <h3 className="mb-2 font-semibold uppercase">
                Condições de pagamento
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-6">
                {budget.paymentConditions}
              </p>
            </section>
          )}

          <div className="grid gap-10 pt-8 sm:grid-cols-2">
            <div className="border-t border-gray-400 pt-2 text-center">
              <p className="font-semibold">{budget.clientName}</p>
              <p className="text-sm">Cliente</p>
            </div>
            <div className="border-t border-gray-400 pt-2 text-center">
              <p className="font-semibold">{budget.companyName}</p>
              <p className="text-sm">Responsável pelo orçamento</p>
            </div>
          </div>

          <div className="mt-8 text-right text-sm">
            {dateFormat(budget.createdAt)}
          </div>
        </article>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>
    </main>
  );
}
