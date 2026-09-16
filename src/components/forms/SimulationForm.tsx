'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    simulationSchema,
    SimulationSchema
} from '@/lib/schemas/simulationSchema'

import {
    Card,
    CardContent
} from '@/components/ui/card'

import { Input } from '@/components/ui/input'

import { Label } from '@/components/ui/label'

import { Button } from '@/components/ui/button'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

import {
    calculateAverageConsumption,
    calculateSystemPower,
    calculateEstimatedGeneration,
    calculateMonthlyGeneration,
    calculatePanels,
    calculateRoofArea,
    calculateMonthlySavings,
} from '@/services/calculations'

import { SimulationResults }
    from '../report/SimulationResults'

import { solarIrradiationMG } from '@/data/solarIrradiation'

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



export function SimulationForm() {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors }
    } = useForm<SimulationSchema>({
        resolver: zodResolver(simulationSchema) as any,
        defaultValues: {
            consumptions: Array(12).fill(0),
            tariff: 0.95,
            connectionType: 'Monofásico',
            customerName: '',
            city: '',
            state: ''
        }
    })

    const searchParams = useSearchParams()
    const [selectedSimulationId, setSelectedSimulationId] = useState<string | null>(null)
    const [clientId, setClientId] = useState<string | null>(null)
    const [savedProposal, setSavedProposal] = useState<any>(null)

    useEffect(() => {
        const simulationId = searchParams.get('simulationId')

        if (!simulationId) {
            return
        }

        const loadFromUrl = async () => {
            const response = await fetch(`/api/simulations/${simulationId}`)

            if (!response.ok) {
                return
            }

            const data = await response.json()
            loadSavedSimulation(data.simulation)
        }

        loadFromUrl().catch(() => undefined)
    }, [searchParams])

    const onSubmit = (data: SimulationSchema) => {

        const averageConsumption =
            calculateAverageConsumption(
                data.consumptions
            )

        const systemPower =
            calculateSystemPower(
                averageConsumption
            )

        const panels =
            calculatePanels(systemPower)

        const roofArea =
            calculateRoofArea(panels)

        const monthlySavings =
            calculateMonthlySavings(
                averageConsumption,
                data.tariff
            )
        const monthlyGeneration =
            calculateMonthlyGeneration(
                solarIrradiationMG,
                systemPower
            )

        const estimatedGeneration =
            calculateEstimatedGeneration(
                panels,
            )

        setResults({
            averageConsumption,
            systemPower,
            panels,
            roofArea,
            monthlySavings,
            monthlyGeneration,
            estimatedGeneration,
        })
    }

    const handleSaveSimulation = async (payload: Record<string, unknown>) => {
        const method = selectedSimulationId ? 'PUT' : 'POST'
        const url = selectedSimulationId ? `/api/simulations/${selectedSimulationId}` : '/api/simulations'

        const requestPayload = {
            ...payload,
            clientId: clientId ?? payload.clientId ?? null,
        }

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestPayload)
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(errorText || 'Não foi possível salvar a simulação.')
        }

        const data = await response.json()
        setSelectedSimulationId(data.simulation?.id ?? selectedSimulationId)
    }

    const loadSavedSimulation = (simulation: any) => {
        const client = simulation.client
        const proposal = simulation.proposal

        const consumptions = Array.isArray(simulation.consumptions)
            ? simulation.consumptions.map(Number)
            : Array(12).fill(0)

        reset({
            customerName: client.name,
            city: client.city,
            state: client.state,
            connectionType: simulation.connectionType ?? 'Monofásico',
            tariff: Number(simulation.tariff) || 0.95,
            consumptions,
        })

        setClientId(client?.id ?? null)
        setSavedProposal(proposal ?? null)
        setSelectedSimulationId(simulation.id)

        const averageConsumption = Number(simulation.averageConsumption)
        const systemPower = Number(simulation.systemPower)
        const panels = Number(simulation.panels)
        const roofArea = Number(simulation.roofArea)
        const monthlySavings = Number(simulation.monthlySavings)
        const estimatedGeneration = Number(simulation.estimatedGeneration)
        const monthlyGeneration = Array.isArray(simulation.monthlyGeneration)
            ? simulation.monthlyGeneration.map(Number)
            : calculateMonthlyGeneration(solarIrradiationMG, systemPower)

        setResults({
            averageConsumption,
            systemPower,
            panels,
            roofArea,
            monthlySavings,
            monthlyGeneration,
            estimatedGeneration,
        })

        if (proposal) {
            setValue('tariff', Number(simulation.tariff) || 0.95)
        }
    }

    const [results, setResults] =
        useState<null | {
            averageConsumption: number
            systemPower: number
            panels: number
            roofArea: number
            monthlySavings: number
            monthlyGeneration: number[]
            estimatedGeneration: number
        }>(null)

    return (
        <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-8 space-y-8">

                <div>
                    <h2 className="text-2xl font-bold">
                        Dados da Simulação
                    </h2>

                    <p className="text-slate-500">
                        Preencha os dados abaixo
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-8"
                >

                    {/* CLIENTE */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="space-y-2">
                            <Label>Nome do Cliente</Label>

                            <Input
                                placeholder="João da Silva"
                                {...register('customerName')}
                            />

                            {errors.customerName && (
                                <span className="text-red-500 text-sm">
                                    Nome inválido
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Cidade</Label>

                            <Input
                                placeholder="Pará de Minas"
                                {...register('city')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Estado</Label>

                            <Input
                                placeholder="MG"
                                {...register('state')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Tipo de Ligação</Label>

                            <Select
                                value={watch('connectionType')}
                                onValueChange={(value) =>
                                    setValue(
                                        'connectionType',
                                        value as 'Monofásico' | 'Bifásico' | 'Trifásico'
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="Monofásico" >
                                        Monofásico
                                    </SelectItem>

                                    <SelectItem value="Bifásico" >
                                        Bifásico
                                    </SelectItem>

                                    <SelectItem value="Trifásico">
                                        Trifásico
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Tarifa de Energia (R$)</Label>

                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0.95"
                                onSelect={(e) =>
                                    e.currentTarget.select()
                                }
                                value={watch('tariff') ?? 0.95}
                                {...register('tariff')}
                            />
                        </div>

                    </div>

                    {/* CONSUMO */}

                    <div className="space-y-4">

                        <div>
                            <h3 className="text-xl font-semibold">
                                Consumo dos Últimos 12 Meses
                            </h3>

                            <p className="text-slate-500 text-sm">
                                Informe o consumo em kWh
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">

                            {months.map((month, index) => (
                                <div
                                    key={month}
                                    className="space-y-2"
                                >
                                    <Label>{month}</Label>

                                    <Input
                                        type="number"
                                        placeholder="0"
                                        onSelect={(e) =>
                                            e.currentTarget.select()
                                        }
                                        {...register(
                                            `consumptions.${index}`
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700"
                    >
                        Calcular Sistema
                    </Button>
                </form>
                {
                    results && (
                        <div className="mt-10">

                            <SimulationResults
                                averageConsumption={
                                    results.averageConsumption
                                }

                                systemPower={
                                    results.systemPower
                                }

                                panels={
                                    results.panels
                                }

                                roofArea={
                                    results.roofArea
                                }

                                monthlySavings={
                                    results.monthlySavings
                                }

                                consumptions={
                                    watch('consumptions')
                                }
                                estimatedGeneration={
                                    results.estimatedGeneration
                                }
                                monthlyGeneration={
                                    results.monthlyGeneration
                                }
                                customerName={watch('customerName')}
                                city={watch('city')}
                                state={watch('state')}
                                onSaveSimulation={handleSaveSimulation}
                                selectedSimulationId={selectedSimulationId}
                                connectionType={watch('connectionType')}
                                tariff={Number(watch('tariff')) || 0.95}
                                coverage={Number((results.estimatedGeneration / results.averageConsumption * 100).toFixed(2)) || 0}
                                proposal={savedProposal}
                            />
                        </div>
                    )
                }
            </CardContent>
        </Card>
    )
}