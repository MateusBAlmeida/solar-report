const encoder = new TextEncoder()

type Controller = ReadableStreamDefaultController

const controllers = new Set<Controller>()

export function registerController(controller: Controller) {
  controllers.add(controller)
}

export function unregisterController(controller: Controller) {
  controllers.delete(controller)
}

export function broadcastMessage(payload: any) {
  const data = `data: ${JSON.stringify(payload)}\n\n`
  const chunk = encoder.encode(data)
  for (const c of controllers) {
    try {
      c.enqueue(chunk)
    } catch (e) {
      // ignore enqueue errors per-controller
    }
  }
}

export function controllersCount() {
  return controllers.size
}

export default null
