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

type Props = {
  consumptions: number[]
  estimatedGeneration: number
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

export function ConsumptionChart({
  consumptions,
  estimatedGeneration
}: Props) {

  const data = consumptions.map(
    (value, index) => ({
      month: months[index],
      consumption: value,
      generation: estimatedGeneration
    })
  )

  return (
    <div className="bg-white rounded-2xl shadow p-6">

      <div className="mb-6">
        <h3 className="text-xl font-bold">
          Consumo Mensal
        </h3>

        <p className="text-slate-500 text-sm">
          Histórico dos últimos 12 meses
        </p>
      </div>

      <div className="h-[350px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="consumption"
              radius={[8, 8, 0, 0]}
            />
            <Line type="monotone" dataKey="generation" stroke="#82ca9d" />

          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}