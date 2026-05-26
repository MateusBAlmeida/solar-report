import { ResultCard }
    from './ResultCard'
import { ConsumptionChart }
    from '../charts/ConsumptionChart'

import { FinancialProjection }
    from '../charts/FinancialProjection'

import { DownloadReportButton }
    from '../pdf/DownloadReportButton'

import { useRef, useState, useEffect } from 'react'

import * as htmlToImage
    from 'html-to-image'

import {
    calculateSystemPowerByPanels,
    calculateMonthlyGeneration,
    calculateEstimatedGeneration,
    calculateMonthlySavings
} from '@/services/calculations'

import { solarIrradiationMG } from '@/data/solarIrradiation'

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
    installationValue: number
    paybackTime: number
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
    monthlyGeneration,
    installationValue,
    paybackTime

}: Props) {
    const chartRef =
        useRef<HTMLDivElement>(null)

    const [chartImage, setChartImage] =
        useState<string>()

    const [editablePanels, setEditablePanels] =
        useState(panels)

    const [recalculatedPower, setRecalculatedPower] =
        useState(systemPower)

    const [recalculatedGeneration, setRecalculatedGeneration] =
        useState(estimatedGeneration)

    const [recalculatedSavings, setRecalculatedSavings] =
        useState(monthlySavings)

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

    useEffect(() => {

        const newPower =
            calculateSystemPowerByPanels(
                editablePanels
            )

        const monthlyGeneration =
            calculateMonthlyGeneration(
                solarIrradiationMG,
                newPower
            )

        const averageGeneration =
            calculateEstimatedGeneration(
                editablePanels
            )

        const newSavings =
            calculateMonthlySavings(
                averageGeneration,
                0.95
            )

        setRecalculatedPower(newPower)

        setRecalculatedGeneration(
            averageGeneration
        )

        setRecalculatedSavings(
            newSavings
        )

    }, [editablePanels])
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
                        recalculatedPower
                    }

                    panels={panels}

                    roofArea={
                        roofArea
                    }

                    monthlySavings={
                        recalculatedSavings
                    }

                    estimatedGeneration={
                        recalculatedGeneration
                    }
                    monthlyGeneration={
                        calculateMonthlyGeneration(
                            solarIrradiationMG,
                            recalculatedPower
                        )
                    }
                    installationValue={
                        installationValue
                    }
                    paybackTime={
                        paybackTime
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
                        value={`${recalculatedPower.toFixed(2).replace('.', ',')} kWp`}
                    />

                    <div className="bg-white rounded-2xl shadow p-6 border border-slate-200">

                        <p className="text-slate-500 text-sm">
                            Quantidade de Placas
                        </p>

                        <input
                            type="number"

                            min={1}

                            value={editablePanels}

                            onChange={(e) =>
                                setEditablePanels(
                                    Number(e.target.value)
                                )
                            }

                            className="mt-3 w-full border rounded-xl px-4 py-3 text-3xl font-bold outline-none"
                        />

                        <p className="text-sm text-slate-400 mt-2">
                            Painéis de 620W
                        </p>

                    </div>

                    <ResultCard
                        title="Área Necessária"
                        value={`${roofArea.toFixed(1)} m²`}
                    />

                    <ResultCard
                        title="Economia Mensal"
                        value={`R$ ${recalculatedSavings.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`}
                    />

                    {/* <ResultCard
                        title="Geração Estimada"
                        value={`${recalculatedGeneration.toFixed(2).replace('.', ',')} kWh/mês`}
                    /> */}

                    <div className="bg-white rounded-2xl shadow p-6 border border-slate-200">

                        <p className="text-slate-500 text-sm">
                            Geração Estimada
                        </p>

                        {

                            recalculatedGeneration > averageConsumption ? (

                                <h4 className="text-2xl font-bold mt-3">
                                    {recalculatedGeneration.toFixed(2).replace('.', ',')} kWh/mês
                                </h4>

                            ) : (

                                <h4 className="text-2xl font-bold mt-3 text-red-600">
                                    {recalculatedGeneration.toFixed(2).replace('.', ',')} kWh/mês
                                </h4> 
                            )

                        }

                    </div>

                    <ResultCard
                        title="Tempo de Retorno da Investimento"
                        value={`${paybackTime.toFixed(1)} meses`}
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
                                <td className="border px-4 py-2">{Number(calculateMonthlyGeneration(solarIrradiationMG, recalculatedPower)[index]).toFixed(2).replace('.', ',')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid xl:grid-cols-2 gap-6">

                <ConsumptionChart
                    ref={chartRef}
                    consumptions={consumptions}
                    monthlyGeneration={calculateMonthlyGeneration(
                        solarIrradiationMG,
                        recalculatedPower
                    )}
                />

                <div className="space-y-6">

                    <FinancialProjection
                        monthlySavings={recalculatedSavings}
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