'use client'

import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
    Bar,
    Line
} from 'recharts'

import { forwardRef } from 'react'

type Props = {
    consumptions: number[]
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

export const ConsumptionChart = forwardRef<
    HTMLDivElement,
    Props
>(({
    consumptions,
    monthlyGeneration
}, ref) => {

    const data = consumptions.map(
        (value, index) => ({
            month: months[index],

            consumption: Number(value),

            generation: Number(
                monthlyGeneration[index]
            )
            
        })
    )

    return (
        <div
            ref={ref}
            className="bg-white rounded-2xl shadow p-6 w-full"
        >

            <div className="mb-6">
                <h3 className="text-xl font-bold">
                    Consumo Mensal
                </h3>

                <p className="text-slate-500 text-sm">
                    Histórico dos últimos 12 meses
                </p>
            </div>

            <div className="w-full h-[350px] min-h-[350px]">

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >

                    <BarChart data={data}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip

                            formatter={(value: any) => `${value.toFixed(2).replace('.', ',')} kWh`}
                            labelFormatter={(label) => `Mês: ${label}`}
                        />

                        <Bar
                            dataKey="consumption"
                            radius={[8, 8, 0, 0]}
                            name='Consumo'
                        />
                        <Line type="monotone" dataKey="generation" name='Geração' />

                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
})
ConsumptionChart.displayName = 'ConsumptionChart'