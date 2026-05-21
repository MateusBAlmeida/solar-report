'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
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

import { useState } from 'react'

import {
    calculateAverageConsumption,
    calculateSystemPower,
    calculateEstimatedGeneration,
    calculatePanels,
    calculateRoofArea,
    calculateMonthlySavings
} from '@/services/calculations'

import { SimulationResults }
    from '../report/SimulationResults'


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
        watch,
        formState: { errors }
    } = useForm<SimulationSchema>({
        resolver: zodResolver(simulationSchema) as any,

        defaultValues: {
            consumptions: Array(12).fill(0)
        }
    })

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

        const estimatedGeneration =
            calculateEstimatedGeneration()

        const monthlySavings =
            calculateMonthlySavings(
                averageConsumption,
                data.tariff
            )

        setResults({
            averageConsumption,
            systemPower,
            panels,
            roofArea,
            monthlySavings,
            estimatedGeneration
        })
    }

    const [results, setResults] =
        useState<null | {
            averageConsumption: number
            systemPower: number
            panels: number
            roofArea: number
            monthlySavings: number
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
                                onValueChange={(value) =>
                                    setValue(
                                        'connectionType',
                                        value as 'mono' | 'bi' | 'tri'
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="mono">
                                        Monofásico
                                    </SelectItem>

                                    <SelectItem value="bi">
                                        Bifásico
                                    </SelectItem>

                                    <SelectItem value="tri">
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
                                customerName={watch('customerName')}
                                city={watch('city')}
                                state={watch('state')}
                            />
                        </div>
                    )
                }
            </CardContent>
        </Card>
    )
}