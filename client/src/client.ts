import { MessagesFromCient, MessagesFromServer } from '@checkers/generic'
import io from 'socket.io-client'
import { ILogger } from './types'

type clientSideParams = {
  socket: SocketIOClient.Socket
  logger: ILogger
}

const clientSide = ({ socket, logger }: clientSideParams) => {
  return {
    emit<M extends keyof MessagesFromCient>(event: M, payload: MessagesFromCient[M]) {
      logger.info(`CLIENT: Sending ${event}`, payload)
      socket.emit(event, payload)
    },
    on<M extends keyof MessagesFromServer>(event: M, handler: (payload: MessagesFromServer[M]) => void) {
      socket.on(event, (payload: any) => {
        logger.info(`CLIENT: Received ${event}`, payload)
        handler(payload)
      })
    },
  }
}

type createClientParams = {
  wsUri: string
  token: string
  logger: ILogger
}

export const createClient = ({ wsUri, logger, token }: createClientParams) => {
  const address = process.env.WEBPACK_DEV_SERVER_HOST
    ? `http://${process.env.WEBPACK_DEV_SERVER_HOST}:${process.env.INTERNAL_BACKEND_WS_PORT}`
    : undefined
  logger.info(`Connecting to ${address || window.location.host}`)
  const socket = address ? io(address) : io()
  const client = clientSide({ socket, logger })

  socket.on('error', (e: any) => {
    logger.info("CLIENT: Error " + JSON.stringify(e || {}))
  })

  socket.on('connect', () => {
    logger.info('CLIENT: Connected to server')
    client.emit('handshake', token)
  })

  return client
}
