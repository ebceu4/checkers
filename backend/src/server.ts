
import Redis, { Redis as IRedis } from 'ioredis'
import io from 'socket.io'
import { parseCallbackQueryToken } from './queryToken'
import { Data, createCheckersGame, GameMove, MessagesFromCient, MessagesFromServer, AorB, CheckersGame, parseMoves, serializeMoves } from '@checkers/generic'
import { redisExt } from './redisExt'

export const serverSide = (socket: io.Socket) => {
  return {
    on: <M extends keyof MessagesFromCient>(message: M, handler: (payload: MessagesFromCient[M]) => void) => {
      socket.on(message, handler)
    },
    emit: (options?: (s: io.Socket) => NodeJS.EventEmitter) => <M extends keyof MessagesFromServer>(message: M, payload: MessagesFromServer[M]) => {
      const opts = options ?? (x => x)
      opts(socket).emit(message, payload)
    },
  }
}

const games: Record<string, CheckersGame> = {}
const getGameLogic = (id: string) => {
  if (!games[id])
    games[id] = createCheckersGame({ boardSize: 8 })

  return games[id]
}

const client = (server: io.Server, socket: io.Socket, redis: IRedis) => {

  let _gameId: string | null = null
  let _player: AorB | 'S' = 'S'

  const { entries } = redisExt(redis)
  const gameData = entries<Data>()

  const { on, emit } = serverSide(socket)
  on('handshake', async (token) => {
    try {
      const { id: callbackQueryId, user } = parseCallbackQueryToken(token)
      const gameKey = `checkers:${callbackQueryId}`
      const existing = (await gameData.get(gameKey).then(x => x ?? { id: gameKey } as Data)) ?? {}
      const handshakingUser = {
        id: user.id.toString(),
        name: user.username ?? user.first_name ?? 'noname'
      }

      existing.users = existing.users || []
      const index = existing.users.findIndex(x => x.id === handshakingUser.id)
      const userIndex = index >= 0 ? index : existing.users.push(handshakingUser) - 1

      const player: AorB | 'S' = userIndex === 0 ? 'A' : userIndex === 1 ? 'B' : 'S'
      const movesKey = `${gameKey}:moves`
      const moves = await redis.get(movesKey).then(x => x || '')

      await gameData.set(gameKey, existing)

      _gameId = existing.id
      _player = player
      socket.join(existing.id)
      console.log(`SERVER: Client connected gameId:${existing.id}, player:${player}`)
      console.log(`TOKEN`, token)
      emit()('handshake', { data: existing, moves, player })
      emit(s => s.broadcast.to(existing.id))('update', existing)

    } catch (error) {
      console.log(error)
    }
  })

  on('move', async (move) => {
    try {
      if (!_gameId)
        throw new Error('No handshake')
      const gameId = _gameId
      if (getGameLogic(gameId).currentPlayer() !== _player)
        throw new Error('Wait for your rurn')
      getGameLogic(gameId).move(move.unitId, move.to)
      const key = `${gameId}:moves`
      const existingMoves = await redis.get(key).then(x => parseMoves(x || ''))
      if (existingMoves.length !== move.id)
        throw new Error(`Expected move ${existingMoves.length} but got ${move.id}`)
      existingMoves.push(move)
      await redis.set(key, serializeMoves(existingMoves))
      emit(s => s.broadcast.to(gameId))('move', move)
    } catch (error) {
      console.log(error)
    }
  })

  socket.on('disconnect', reason => {
    emit(s => s.broadcast.to(_gameId!))('update', { id: _gameId!, online: { [_player!]: false } })
    console.log(`Player ${_player} disconnected from ${_gameId}`)
  })
}

export const server = () => {
  const server = io(process.env.INTERNAL_BACKEND_WS_PORT!) //.adapter(redisAdapter({ host: process.env.REDIS_HOST, port: 6379 }))
  const redisSubscriber = new Redis(process.env.REDIS_URL)
  const redisIO = new Redis(process.env.REDIS_URL)

  return {
    start() {

      console.log("server start")

      server.on('connection', socket => {
        console.log("CONNECTION")
        client(server, socket, redisIO)
      })
    }
  }
}

// const subscribeKeySet = async (redisSubscriber: IRedis, redisReader: IRedis, key: string, handler: (value: string | null) => void) => {
//   const subsCount = await redisSubscriber.subscribe(`__keyspace@0__:${key}`)
//   redisSubscriber.on('message', async (channel, message) => {
//     if (message === 'set') {
//       const value = await redisReader.get(key)
//       handler(value)
//     }
//   })

//   return () =>
//     redisSubscriber.unsubscribe(`__keyspace@0__:${key}`)
// }

//__keyevent@0__:set
//psubscribe '__key*__:*'
