'use client'

import { PDFDownloadLink }
from '@react-pdf/renderer'

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
}

export function DownloadReportButton(
  props: Props
) {

  return (

    <PDFDownloadLink
      document={
        <ReportDocument {...props} />
      }

      fileName="relatorio-fotovoltaico.pdf"
    >

      {({ loading }) => (

        <Button
          className="bg-green-600 hover:bg-green-700"
        >

          {
            loading
              ? 'Gerando PDF...'
              : 'Baixar Relatório PDF'
          }

        </Button>
      )}

    </PDFDownloadLink>
  )
}