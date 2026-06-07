'use client'

import { pdf } from '@react-pdf/renderer'

import { Button }
  from '@/components/ui/button'

import { ReportDocument }
  from './ReportDocument'

type Props = {
  customerName: string
  city: string
  state: string

  averageConsumption: number
  systemPower: number
  panels: number
  roofArea: number
  monthlySavings: number

  estimatedGeneration: number
  monthlyGeneration: number[]
  chartImage?: string
  kitPrice: number
  projectPrice: number
  installationPrice: number
  totalInvestment: number
  paybackYears: number
  annualSavings: number
  descriptionPlacas: string
  descriptionInversor: string
  generateChartImage:
  () => Promise<string | undefined>
}

export function DownloadReportButton(
  props: Props
) {

  async function handleDownload() {

    const chartImage =
      await props.generateChartImage()

    const blob = await pdf(

      <ReportDocument
        {...props}
        chartImage={chartImage}
      />

    ).toBlob()

    const url =
      URL.createObjectURL(blob)

    const link =
      document.createElement('a')

    link.href = url

    link.download =
      'relatorio-fotovoltaico.pdf'

    link.click()

    URL.revokeObjectURL(url)
  }

  return (

    <Button
      onClick={handleDownload}
      className="bg-green-600 hover:bg-green-700"
    >
      Baixar Relatório PDF
    </Button>

  )
}