import { AorB, GameMove } from './domain'

export type Player = { id: string, name: string }

export type MessagesFromCient = {
  handshake: string
  move: GameMove
}

export type MessagesFromServer = {
  handshake: { data: Data, moves: string, player: AorB | 'S' }
  update: Data
  move: GameMove
}

type Users = {
  users?: Player[]
}

type Online = {
  online?: {
    A?: boolean
    B?: boolean
  }
}

type GameData = {
  id: string
  winner?: AorB
}

export type Data =
  & GameData
  & Users
  & Online

