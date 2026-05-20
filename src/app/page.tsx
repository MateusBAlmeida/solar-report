import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">
          Solar Report
        </h1>

        <p className="text-slate-600">
          Simulador de geração fotovoltaica
        </p>

        <Link
          href="/simulator"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
        >
          Iniciar Simulação
        </Link>
      </div>
    </main>
  )
}