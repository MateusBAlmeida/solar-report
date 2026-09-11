import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function SimulationsPage() {
  const simulations = await prisma.simulation.findMany({
    include: {
      client: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Simulações salvas</h1>
            <p className="text-slate-600">Selecione uma proposta para editar.</p>
          </div>

          <Link
            href="/simulator"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
          >
            Nova simulação
          </Link>
        </div>

        {simulations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
            Nenhuma simulação salva ainda.
          </div>
        ) : (
          <div className="grid gap-4">
            {simulations.map((simulation) => (
              <Link
                key={simulation.id}
                href={`/simulator?simulationId=${simulation.id}`}
                className="block bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-green-500 transition"
              >
                <div className="flex justify-between gap-4 flex-wrap items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{simulation.client.name}</h2>
                    <p className="text-sm text-slate-500">
                      {simulation.client.city} - {simulation.client.state}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-500">Potência</p>
                    <p className="font-semibold">{Number(simulation.systemPower).toFixed(2)} kWp</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-slate-600">
                  <div>
                    <span className="block text-slate-400">Consumo médio</span>
                    {Number(simulation.averageConsumption).toFixed(2)} kWh
                  </div>
                  <div>
                    <span className="block text-slate-400">Painéis</span>
                    {simulation.panels}
                  </div>
                  <div>
                    <span className="block text-slate-400">Economia</span>
                    R$ {Number(simulation.monthlySavings).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div>
                    <span className="block text-slate-400">Criado em</span>
                    {new Date(simulation.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
