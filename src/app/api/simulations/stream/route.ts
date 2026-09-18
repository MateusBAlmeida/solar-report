import { registerController, unregisterController } from '@/lib/realtime'

export async function GET() {
  let localController: ReadableStreamDefaultController | null = null
  const stream = new ReadableStream({
    start(controller) {
      localController = controller
      // send a comment to establish the stream
      controller.enqueue(new TextEncoder().encode(':ok\n\n'))
      registerController(controller)
    },
    cancel() {
      if (localController) {
        try {
          unregisterController(localController)
        } catch (e) {
          // ignore
        }
        localController = null
      }
    },
  })

  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })

  // We can't detect controller close from here easily — unregister when stream is closed externally
  // Consumers will be cleaned up via GC in typical Node setups; this is sufficient for dev/testing.

  return new Response(stream, { headers })
}
