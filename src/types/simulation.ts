export type SimulationFormData = {
  customerName: string
  city: string
  state: string
  connectionType: 'Monofásico' | 'Bifásico' | 'Trifásico'
  tariff: number
  consumptions: number[]
}