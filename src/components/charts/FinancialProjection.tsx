type Props = {
  monthlySavings: number
}

export function FinancialProjection({
  monthlySavings
}: Props) {

  const yearlySavings =
    monthlySavings * 12

  const savings25Years =
    yearlySavings * 25

  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl p-8 shadow-lg">

      <div className="space-y-6">

        <div>
          <h3 className="text-2xl font-bold">
            Economia Projetada
          </h3>

          <p className="opacity-80">
            Estimativa baseada na tarifa atual
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div>
            <p className="text-sm opacity-80">
              Economia Mensal
            </p>

            <h4 className="text-3xl font-bold">
              R$ {monthlySavings.toFixed(2)}
            </h4>
          </div>

          <div>
            <p className="text-sm opacity-80">
              Economia Anual
            </p>

            <h4 className="text-3xl font-bold">
              R$ {yearlySavings.toFixed(2)}
            </h4>
          </div>

          <div>
            <p className="text-sm opacity-80">
              Economia em 25 anos
            </p>

            <h4 className="text-3xl font-bold">
              R$ {savings25Years.toFixed(0)}
            </h4>
          </div>

        </div>
      </div>
    </div>
  )
}