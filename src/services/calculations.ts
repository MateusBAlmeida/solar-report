export function calculateAverageConsumption(
  consumptions: number[]
) {
  const total = consumptions.reduce(
    (acc, item) => acc + item,
    0
  )

  return total / consumptions.length
}

export function calculateSystemPower(
  averageConsumption: number,
  irradiation = 5.5,
  efficiency = 0.8
) {
  return (
    averageConsumption /
    (irradiation * 30 * efficiency)
  )
}

export function calculatePanels(
  systemPower: number,
  panelPower = 0.55
) {
  return Math.ceil(systemPower / panelPower)
}

export function calculateRoofArea(
  panels: number
) {
  return panels * 2.3
}

export function calculateMonthlySavings(
  averageConsumption: number,
  tariff: number
) {
  return averageConsumption * tariff
}