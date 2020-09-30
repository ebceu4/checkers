import { initialCheckersGameState } from './checkersGameState'
import { Position } from './domain'
import { parseMoves } from './utils'

type createCheckersGameParams = {
  boardSize: number
}

export const createCheckersGame = ({ boardSize }: createCheckersGameParams) => {
  let state = initialCheckersGameState(boardSize)

  const move = (unitId: string, to: Position) => {
    state = state.move({ id: state.nextMoveId(), unitId, to })
    return state.lastMove()!
  }

  const loadMoves = (movesData: string) => {
    const moves = parseMoves(movesData)
    state = initialCheckersGameState(boardSize)
    state = moves.reduce((state, move, id) => state.move({ ...move, id }), state)
    return state.units
  }

  const possibleMovesForUnit = (unitId: string) =>
    state.possibleMovesForUnit(unitId)

  const units = () => state.units
  const getUnitAtPos = (pos?: Position) => state.getUnitAtPos(pos)
  const currentPlayer = () => state.currentPlayer()
  const lastMove = () => state.lastMove()

  return {
    units,
    lastMove,
    getUnitAtPos,
    currentPlayer,
    boardSize,
    move,
    loadMoves,
    possibleMovesForUnit,
  }
}


export type CheckersGame = ReturnType<typeof createCheckersGame>
export type CheckersGameReadOnly = Omit<CheckersGame, 'move' | 'loadMoves'>