export type SimulationFormData = {
  customerName: string
  city: string
  state: string
  connectionType: 'mono' | 'bi' | 'tri'
  tariff: number
  consumptions: number[]
}