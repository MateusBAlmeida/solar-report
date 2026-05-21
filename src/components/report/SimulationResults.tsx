import { ResultCard }
    from './ResultCard'
import { ConsumptionChart }
    from '../charts/ConsumptionChart'

import { FinancialProjection }
    from '../charts/FinancialProjection'

import { DownloadReportButton }
    from '../pdf/DownloadReportButton'

type Props = {
    averageConsumption: number
    systemPower: number
    panels: number
    roofArea: number
    monthlySavings: number
    consumptions: number[]
    customerName: string
    city: string
    state: string
    estimatedGeneration: number
}

export function SimulationResults({
    averageConsumption,
    systemPower,
    panels,
    roofArea,
    monthlySavings,
    consumptions,
    customerName,
    city,
    state,
    estimatedGeneration
}: Props) {
    return (
        <div className="space-y-6">

            <div>
                <h2 className="text-3xl font-bold">
                    Resultado da Simulação
                </h2>

                <DownloadReportButton

                    customerName={customerName}
                    city={city}
                    state={state}

                    averageConsumption={
                        averageConsumption
                    }

                    systemPower={
                        systemPower
                    }

                    panels={panels}

                    roofArea={roofArea}

                    monthlySavings={
                        monthlySavings
                    }
                    estimatedGeneration={estimatedGeneration}
                />

                <p className="text-slate-500">
                    Dimensionamento estimado do sistema
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">

                <ResultCard
                    title="Consumo Médio"
                    value={`${averageConsumption.toFixed(0)} kWh`}
                />

                <ResultCard
                    title="Potência do Sistema"
                    value={`${systemPower.toFixed(2)} kWp`}
                />

                <ResultCard
                    title="Quantidade de Placas"
                    value={`${panels}`}
                    subtitle="Painéis de 545W"
                />

                <ResultCard
                    title="Área Necessária"
                    value={`${roofArea.toFixed(1)} m²`}
                />

                <ResultCard
                    title="Economia Mensal"
                    value={`R$ ${monthlySavings.toFixed(2)}`}
                />

                <ResultCard
                    title="Geração Estimada"
                    value={`${estimatedGeneration.toFixed(2)} kWh/mês`}
                />
            </div>
            <div className="grid xl:grid-cols-2 gap-6">

                <ConsumptionChart
                    consumptions={consumptions}
                    estimatedGeneration={estimatedGeneration}
                />

                <div className="space-y-6">

                    <FinancialProjection
                        monthlySavings={monthlySavings}
                    />

                    <div className="bg-white rounded-2xl shadow p-6">

                        <h3 className="text-xl font-bold mb-4">
                            Impacto Ambiental
                        </h3>

                        {/* <div className="space-y-4">

                            <div>
                                <p className="text-slate-500 text-sm">
                                    CO₂ evitado por ano
                                </p>

                                <h4 className="text-2xl font-bold">
                                    {(averageConsumption * 0.084 * 12).toFixed(0)} kg
                                </h4>
                            </div>

                            <div>
                                <p className="text-slate-500 text-sm">
                                    Árvores equivalentes
                                </p>

                                <h4 className="text-2xl font-bold">
                                    {(averageConsumption * 0.02).toFixed(0)}
                                </h4>
                            </div>

                        </div> */}
                    </div>

                </div>

            </div>
        </div>
    )
}