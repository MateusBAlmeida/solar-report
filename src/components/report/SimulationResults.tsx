import { ResultCard }
    from './ResultCard'
import { ConsumptionChart }
    from '../charts/ConsumptionChart'

import { FinancialProjection }
    from '../charts/FinancialProjection'

import { DownloadReportButton }
    from '../pdf/DownloadReportButton'

import { useRef, useState } from 'react'

import * as htmlToImage
    from 'html-to-image'

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
    monthlyGeneration: number[]
}

const months = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez'
]

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
    estimatedGeneration,
    monthlyGeneration

}: Props) {
    const chartRef =
        useRef<HTMLDivElement>(null)

    const [chartImage, setChartImage] =
        useState<string>()

    async function generateChartImage() {

        if (!chartRef.current) return

        const dataUrl =
            await htmlToImage.toPng(
                chartRef.current
            )

        return dataUrl
    }
    async function handleGeneratePdf() {

        const image =
            await generateChartImage()

        setChartImage(image)
    }
    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between gap-4 flex-wrap">

                <div>
                    <h2 className="text-3xl font-bold">
                        Resultado da Simulação
                    </h2>

                    <p className="text-slate-500">
                        Dimensionamento estimado do sistema
                    </p>
                </div>

                <DownloadReportButton

                    generateChartImage={
                        generateChartImage
                    }

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

                    roofArea={
                        roofArea
                    }

                    monthlySavings={
                        monthlySavings
                    }

                    estimatedGeneration={
                        estimatedGeneration
                    }
                />

            </div>


            <div className="grid xl:grid-cols-2 gap-6 bg-white rounded-2xl shadow p-6 border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                    <ResultCard
                        title="Consumo Médio"
                        value={`${averageConsumption.toFixed(2).replace('.', ',')} kWh`}
                    />

                    <ResultCard
                        title="Potência do Sistema"
                        value={`${systemPower.toFixed(2).replace('.', ',')} kWp`}
                    />

                    <ResultCard
                        title="Quantidade de Placas"
                        value={`${panels}`}
                        subtitle="Painéis de 620W"
                    />

                    <ResultCard
                        title="Área Necessária"
                        value={`${roofArea.toFixed(1)} m²`}
                    />

                    <ResultCard
                        title="Economia Mensal"
                        value={`R$ ${monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    />

                    <ResultCard
                        title="Geração Estimada"
                        value={`${estimatedGeneration.toFixed(2).replace('.', ',')} kWh/mês`}
                    />
                </div>
                <table className="w-full border-collapse border border-slate-200 rounded-lg overflow-hidden bg-white p-6 mb-6 text-center">

                    <thead>
                        <tr className="bg-green-50">
                            <th className="border px-4 py-2">Mês</th>
                            <th className="border px-4 py-2">Consumo (kWh)</th>
                            <th className="border px-4 py-2">Geração (kWh)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {consumptions.map((consumption, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="border px-4 py-2">{months[index]}</td>
                                <td className="border px-4 py-2">{Number(consumption).toFixed(2).replace('.', ',')}</td>
                                <td className="border px-4 py-2">{Number(monthlyGeneration[index]).toFixed(2).replace('.', ',')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid xl:grid-cols-2 gap-6">

                <ConsumptionChart
                    ref={chartRef}
                    consumptions={consumptions}
                    monthlyGeneration={monthlyGeneration}
                />

                <div className="space-y-6">

                    <FinancialProjection
                        monthlySavings={monthlySavings}
                    />

                    <div className="bg-white rounded-2xl border border-slate-200 shadow p-6">

                        <h3 className="text-xl font-bold mb-4">
                            Impacto Ambiental
                        </h3>

                        <div className="space-y-4">

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

                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}