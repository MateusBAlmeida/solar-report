import Link from 'next/link'
import { Suspense } from 'react'
import { SimulationForm }
from '@/components/forms/SimulationForm'

export default function SimulatorPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between gap-3 flex-wrap mb-8">
          <h1 className="text-4xl font-bold">
            Simulador Fotovoltaico
          </h1>

          <Link
            href="/simulations"
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl"
          >
            Ver simulações salvas
          </Link>
        </div>

        <Suspense fallback={<div className="bg-white rounded-2xl p-8 text-slate-500">Carregando simulador...</div>}>
          <SimulationForm />
        </Suspense>
      </div>
    </main>
  )
}