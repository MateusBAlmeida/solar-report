
"use client";

import { useState } from "react";
import { Plus, Trash2, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

type BudgetItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

const currency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const formatPriceInput = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(value);

const parsePriceInput = (value: string) => {
  const normalized = value.replace(".", "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const maskPriceInput = (value: string) => {
  const digits = value.replace(/\D/g, "");

  if (!digits) return "";

  const integerPart = digits.length > 3 ? digits.slice(0, -2) : "0";
  const decimalPart = digits.slice(-2).padStart(2, "0");

  return `${integerPart.replace(/^0+(?=\d)/, "") || "0"},${decimalPart}`;
};

export default function BudgetsPage() {
  const [clientName, setClientName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [activitiesDescription, setActivitiesDescription] = useState("");
  const [observations, setObservations] = useState("");
  const [paymentConditions, setPaymentConditions] = useState("");
  const [items, setItems] = useState<BudgetItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  function updateItem(
    index: number,
    field: keyof BudgetItem,
    value: string
  ) {
    setItems((current) =>
      current.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === "description"
                  ? value
                  : field === "unitPrice"
                    ? parsePriceInput(value)
                    : Number(value),
            }
          : item
      )
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      { description: "", quantity: 1, unitPrice: 0 },
    ]);
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: "ElTec Elétrica",
          companyCnpj: "28.319.381/0001-95",
          companyAddress:
            "Sítio Santa Luzia, S/N. Limas do Pará, Pará de Minas - MG",
          companyPhone: "37 9 9779-5059",
          companyEmail: "eletricaeltec@gmail.com",
          clientName,
          projectTitle,
          activitiesDescription,
          observations,
          paymentConditions,
          items,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Não foi possível salvar.");
      }

      setMessage(`Orçamento ${result.number} salvo com sucesso!`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Erro ao salvar o orçamento."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

  const labelClass = "mb-1.5 block text-sm font-medium";

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/budgets"
            className="rounded-lg border bg-background p-2 hover:bg-muted"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Novo orçamento</h1>
            <p className="text-sm text-muted-foreground">
              Preencha os dados e adicione os itens do orçamento.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-semibold">
              <FileText className="h-4 w-4" />
              Dados do projeto
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Cliente</label>
                <input
                  className={inputClass}
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                  placeholder="Nome do cliente"
                />
              </div>

              <div>
                <label className={labelClass}>Título do projeto</label>
                <input
                  className={inputClass}
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  required
                  placeholder="Nome do projeto ou serviço"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  Descrição das atividades
                </label>
                <textarea
                  className={inputClass}
                  rows={4}
                  value={activitiesDescription}
                  onChange={(e) =>
                    setActivitiesDescription(e.target.value)
                  }
                  placeholder="Descreva os serviços e atividades..."
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-semibold">Itens do orçamento</h2>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
              >
                <Plus className="h-4 w-4" />
                Adicionar item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-lg border p-3 md:grid-cols-[minmax(0,1fr)_100px_150px_150px_40px]"
                >
                  <div>
                    <label className={labelClass}>Descrição</label>
                    <input
                      className={inputClass}
                      value={item.description}
                      onChange={(e) =>
                        updateItem(index, "description", e.target.value)
                      }
                      required
                      placeholder="Produto ou serviço"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Quantidade</label>
                    <input
                      className={inputClass}
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Preço unitário</label>
                    <input
                      className={inputClass}
                      type="text"
                      inputMode="numeric"
                      min="0"
                      step="0.01"
                      placeholder="0,00"
                      value={formatPriceInput(item.unitPrice)}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "unitPrice",
                          maskPriceInput(e.target.value)
                        )
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Subtotal</label>
                    <div className="flex h-9 items-center text-sm font-medium">
                      {currency(item.quantity * item.unitPrice)}
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="rounded-lg p-2 text-destructive hover:bg-destructive/10 disabled:opacity-30"
                      aria-label="Remover item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end border-t pt-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Valor total
                </p>
                <p className="text-2xl font-semibold">{currency(total)}</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 font-semibold">Condições e observações</h2>

            <div className="grid gap-4">
              <div>
                <label className={labelClass}>Observações</label>
                <textarea
                  className={inputClass}
                  rows={3}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Observações adicionais..."
                />
              </div>

              <div>
                <label className={labelClass}>
                  Condições de pagamento
                </label>
                <textarea
                  className={inputClass}
                  rows={2}
                  value={paymentConditions}
                  onChange={(e) => setPaymentConditions(e.target.value)}
                  placeholder="Ex.: Pagamento a combinar"
                />
              </div>
            </div>
          </section>

          {message && (
            <p className="rounded-lg border bg-background p-3 text-sm">
              {message}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar orçamento"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
