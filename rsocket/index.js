import { RSocketConnector } from 'rsocket-core'
import { WebsocketClientTransport } from 'rsocket-websocket-client'
import WebSocket from 'isomorphic-ws'

let rsocket

function connector() {
  return new RSocketConnector({
    setup: {
      dataMimeType: 'application/json',
    },
    transport: new WebsocketClientTransport({
      url: process.env.rsocketURL,
      wsCreator: (url) => new WebSocket(url),
    }),
  })
}

async function getRsocket() {
  if (!rsocket) {
    rsocket = await connector().connect()
  }
  return rsocket
}

async function getLatestSensingData(n) {
  const rsocket = await getRsocket()
  return await new Promise((resolve, reject) => {
    const payloads = []
    rsocket.requestStream(
      {
        data: Buffer.from(n.toString()),
      },
      n,
      {
        onError: (e) => reject(e),
        onNext: (payload, isComplete) => {
          payloads.push(JSON.parse(payload.data))
          setTimeout(() => {
            resolve(payloads)
          })
        },
        onComplete: () => {},
        onExtension: () => {},
      }
    )
  })
}

export { getLatestSensingData }
