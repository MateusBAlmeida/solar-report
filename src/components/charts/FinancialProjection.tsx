type Props = {
  monthlySavings: number
}

export function FinancialProjection({
  monthlySavings
}: Props) {

  const yearlySavings =
    monthlySavings * 12

  const savings5Years =
    yearlySavings * 5

  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl p-8 shadow">

      <div className="space-y-6">

        <div>
          <h3 className="text-2xl font-bold">
            Economia Projetada
          </h3>

          <p className="opacity-80">
            Estimativa baseada na tarifa atual
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">

          <div>
            <p className="text-sm opacity-80">
              Economia Mensal
            </p>

            <h4 className="text-2xl font-bold">
              R$ {monthlySavings.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            </h4>
          </div>

          <div>
            <p className="text-sm opacity-80">
              Economia Anual
            </p>

            <h4 className="text-2xl font-bold">
              R$ {yearlySavings.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            </h4>
          </div>

          <div>
            <p className="text-sm opacity-80">
              Economia em 5 anos
            </p>

            <h4 className="text-2xl font-bold">
              R$ {savings5Years.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            </h4>
          </div>

        </div>
      </div>
    </div>
  )
}