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
  irradiation = 5.152,
  efficiency = 0.8
) {
  return (
    averageConsumption /
    (irradiation * 30.4 * efficiency)
  )
}

export function calculateEstimatedGeneration(
  panels: number,
  irradiation = 5.152,
  efficiency = 0.8
) {

  return (
    panels * 0.62 * irradiation * 30.4 * efficiency
  )
}

export function calculateMonthlyGeneration(
  irradiationData: number[],
  systemPower: number,
  efficiency = 0.8
) {

  return irradiationData.map(
    irradiation => {

      return (
        systemPower *
        irradiation *
        30 *
        efficiency
      )
    }
  )
}

export function calculateAverageGeneration(
  monthlyGeneration: number[]
) {

  const total =
    monthlyGeneration.reduce(
      (acc, item) => acc + item,
      0
    )

  return total / 12
}

export function calculatePanels(
  systemPower: number,
  panelPower = 0.62
) {
  return Math.ceil(systemPower / panelPower)
}

export function calculateRoofArea(
  panels: number
) {
  return panels * 2.556048
}

export function calculateMonthlySavings(
  averageConsumption: number,
  tariff: number
) {
  return averageConsumption * tariff
}

export function calculateSystemPowerByPanels(
  panels: number
) {

  return panels * 0.62
}