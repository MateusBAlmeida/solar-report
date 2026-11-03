
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  FileText,
  Eye,
  Trash2,
  RefreshCw,
  Home,
} from "lucide-react";

type Budget = {
  id: string;
  number: string;
  clientName: string;
  projectTitle: string;
  total: number;
  createdAt: string;
};

const currency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const dateFormat = (value: string) =>
  new Intl.DateTimeFormat("pt-BR").format(new Date(value));

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBudgets = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/budgets");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Erro ao carregar orçamentos.");
      }

      setBudgets(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os orçamentos."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBudgets();
  }, [loadBudgets]);

  async function handleDelete(budget: Budget) {
    const confirmed = window.confirm(
      `Deseja excluir o orçamento ${budget.number}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/budgets/${budget.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Não foi possível excluir.");
      }

      setBudgets((current) =>
        current.filter((item) => item.id !== budget.id)
      );
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Erro ao excluir orçamento."
      );
    }
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold">Orçamentos</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Consulte e gerencie os orçamentos cadastrados.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm hover:bg-muted"
            >
              <Home className="h-4 w-4" />
              Voltar
            </Link>
            <button
              type="button"
              onClick={loadBudgets}
              className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm hover:bg-muted"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </button>

            <Link
              href="/budgets/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Novo orçamento
            </Link>
          </div>
        </header>

        <section className="overflow-hidden rounded-xl border bg-card">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Carregando orçamentos...
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <button
                onClick={loadBudgets}
                className="mt-3 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
              >
                Tentar novamente
              </button>
            </div>
          ) : budgets.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-10 text-center">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <div>
                <h2 className="font-medium">Nenhum orçamento cadastrado</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Crie seu primeiro orçamento para começar.
                </p>
              </div>
              <Link
                href="/budgets/new"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Criar orçamento
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Número</th>
                    <th className="px-4 py-3 font-medium">Cliente</th>
                    <th className="px-4 py-3 font-medium">Projeto</th>
                    <th className="px-4 py-3 font-medium">Data</th>
                    <th className="px-4 py-3 text-right font-medium">Total</th>
                    <th className="px-4 py-3 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {budgets.map((budget) => (
                    <tr key={budget.id} className="hover:bg-muted/30">
                      <td className="whitespace-nowrap px-4 py-3 font-medium">
                        {budget.number}
                      </td>
                      <td className="px-4 py-3">{budget.clientName}</td>
                      <td className="px-4 py-3">{budget.projectTitle}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {dateFormat(budget.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-medium">
                        {currency(budget.total)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Link
                            href={`/budgets/${budget.id}`}
                            className="rounded-lg p-2 hover:bg-muted"
                            title="Visualizar"
                            aria-label="Visualizar orçamento"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(budget)}
                            className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                            title="Excluir"
                            aria-label="Excluir orçamento"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {!loading && !error && budgets.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {budgets.length} orçamento(s) cadastrado(s)
          </p>
        )}
      </div>
    </main>
  );
}
