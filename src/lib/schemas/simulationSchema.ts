import { z } from 'zod'

export const simulationSchema = z.object({
  customerName: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),

  connectionType: z.enum([
    'mono',
    'bi',
    'tri'
  ]),

  tariff: z.coerce.number().positive(),

  consumptions: z
    .array(z.coerce.number().positive())
    .length(12)
})

export type SimulationSchema =
  z.infer<typeof simulationSchema>