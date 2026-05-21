import { SimulationForm }
from '@/components/forms/SimulationForm'

export default function SimulatorPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Simulador Fotovoltaico
        </h1>

        <SimulationForm />
      </div>
    </main>
  )
}