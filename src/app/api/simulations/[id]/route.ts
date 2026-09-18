import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { broadcastMessage } from '@/lib/realtime'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const simulation = await prisma.simulation.findUnique({
      where: { id },
      include: {
        client: true,
        proposal: true,
      },
    })

    if (!simulation) {
      return NextResponse.json(
        { error: 'Simulação não encontrada.' },
        { status: 404 }
      )
    }

    // broadcast updated simulation to connected realtime clients
    try {
      broadcastMessage({ type: 'updated', simulation })
    } catch (e) {
      console.error('Erro ao broadcast atualizar simulação:', e)
    }

    return NextResponse.json({ simulation })
  } catch (error) {
    console.error('Erro ao buscar simulação:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar simulação.' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const currentSimulation = await prisma.simulation.findUnique({
      where: { id },
      include: { client: true },
    })

    const clientId = body.clientId ?? currentSimulation?.clientId ?? null

    const simulation = await prisma.$transaction(async (tx: any) => {
      const client = clientId
        ? await tx.client.upsert({
            where: { id: clientId },
            update: {
              name: body.customerName,
              city: body.city,
              state: body.state,
            },
            create: {
              id: clientId,
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

      const updated = await tx.simulation.update({
        where: { id },
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

      await tx.proposal.upsert({
        where: { simulationId: updated.id },
        update: {
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
        create: {
          simulationId: updated.id,
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
        where: { id: updated.id },
        include: {
          client: true,
          proposal: true,
        },
      })
    })

    return NextResponse.json({ simulation })
  } catch (error) {
    console.error('Erro ao atualizar simulação:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar simulação.' },
      { status: 500 }
    )
  }
}
