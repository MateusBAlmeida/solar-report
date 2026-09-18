import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { broadcastMessage } from '@/lib/realtime'

export async function GET() {
  try {
    const simulations = await prisma.simulation.findMany({
      include: {
        client: true,
        proposal: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ simulations })
  } catch (error) {
    console.error('Erro ao listar simulações:', error)
    return NextResponse.json(
      { error: 'Erro ao listar simulações.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.customerName || !body.city || !body.state) {
      return NextResponse.json(
        { error: 'Dados do cliente incompletos.' },
        { status: 400 }
      )
    }

    const simulation = await prisma.$transaction(async (tx: any) => {
      const client = body.clientId
        ? await tx.client.upsert({
            where: { id: body.clientId },
            update: {
              name: body.customerName,
              city: body.city,
              state: body.state,
            },
            create: {
              id: body.clientId,
              name: body.customerName,
              city: body.city,
              state: body.state,
            },
          })
        : await tx.client.create({
            data: {
              name: body.customerName,
              city: body.city,
              state: body.state,
            },
          })

      const created = await tx.simulation.create({
        data: {
          averageConsumption: Number(body.averageConsumption ?? 0),
          systemPower: Number(body.systemPower ?? 0),
          panels: Number(body.panels ?? 0),
          roofArea: Number(body.roofArea ?? 0),
          estimatedGeneration: Number(body.estimatedGeneration ?? 0),
          monthlyGeneration: Array.isArray(body.monthlyGeneration) ? body.monthlyGeneration : [],
          monthlySavings: Number(body.monthlySavings ?? 0),
          coverage: Number(body.coverage ?? 0),
          connectionType: String(body.connectionType ?? 'Monofásico'),
          tariff: Number(body.tariff ?? 0.95),
          consumptions: Array.isArray(body.consumptions) ? body.consumptions : [],
          clientId: client.id,
        },
      })

      await tx.proposal.create({
        data: {
          simulationId: created.id,
          kitPrice: Number(body.kitPrice ?? 0),
          projectPrice: Number(body.projectPrice ?? 0),
          installationPrice: Number(body.installationPrice ?? 0),
          totalInvestment: Number(body.totalInvestment ?? 0),
          paybackYears: Number(body.paybackYears ?? 0),
          pdfUrl: body.pdfUrl ?? null,
          descriptionPlacas: body.descriptionPlacas ?? '',
          descriptionInversor: body.descriptionInversor ?? '',
          inversor: body.inversor ?? '',
        },
      })

      return tx.simulation.findUnique({
        where: { id: created.id },
        include: {
          client: true,
          proposal: true,
        },
      })
    })

    // broadcast new simulation to connected realtime clients
    try {
      broadcastMessage({ type: 'created', simulation })
    } catch (e) {
      console.error('Erro ao broadcast criar simulação:', e)
    }

    return NextResponse.json({ simulation })
  } catch (error) {
    console.error('Erro ao criar simulação:', error)
    return NextResponse.json(
      { error: 'Erro ao criar simulação.' },
      { status: 500 }
    )
  }
}
