import { AorB, Position, GameMove } from './domain'
import { diagonals, playerDirectionY, positionToXY, xyToPosition } from './utils'

export type CheckersGameUnit = {
  id: string
  pos: Position
  player: AorB
  king: Boolean
}

const createCheckersGameUnit = (id: string, pos: Position) => ({
  id,
  pos,
  player: id.includes('A') ? 'A' : 'B' as AorB,
  king: false,
})

export const printMove = (move: GameMove) => `${move.id}:${move.unitId}:${move.to}`

export type GameMoveResult = {
  id: number
  unitId: string
  player: AorB
  to: Position
  killed?: string
  king?: boolean
}

export const initialCheckersGameState = (boardSize: number) => {
  const units: CheckersGameUnit[] = []
  const count = {
    A: 0,
    B: 0,
  }
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      if (!((x + y) % 2 !== 0 && (y <= 2 || y >= 5)))
        continue
      const player = y > boardSize / 2 ? 'A' : 'B' as AorB
      const c = ++count[player]
      const id = `${c}${player}`
      units.push(createCheckersGameUnit(id, xyToPosition(x, y)))
    }
  }
  return createCheckersGameState({ units: units, moves: [] })
}


type createCheckersGameStateParams = {
  units: CheckersGameUnit[]
  moves: GameMoveResult[]
}

const createCheckersGameState = ({ units, moves }: createCheckersGameStateParams) => {

  const lastMove = () => moves.length > 0 ? moves[moves.length - 1] : undefined
  const nextMoveId = () => (lastMove()?.id ?? -1) + 1
  const getUnitAtPos = (pos?: Position) => units.find(unit => unit?.pos === pos)
  const isEmpty = (pos: Position) => getUnitAtPos(pos) === undefined

  const possibleAttackMovesForUnit = (unit: CheckersGameUnit): GameMoveResult[] => {
    const direction = !unit.king ? playerDirectionY(unit.player) : undefined
    const d1 = diagonals(unit.pos, 1, direction)
    const d2 = diagonals(unit.pos, 2, direction)

    if (d1.length != d2.length) {
      console.log("OOOPS!!!")
    }

    const result = [] as GameMoveResult[]
    const id = nextMoveId()
    for (let i = 0; i < d1.length; i++) {
      if (d1[i].length > 0 && d2[i].length > 0) {
        const anotherUnit = getUnitAtPos(d1[i])
        if (anotherUnit && isEmpty(d2[i]) && anotherUnit.player !== unit.player) {
          result.push({ unitId: unit.id, to: d2[i], id, killed: anotherUnit.id, player: unit.player })
        }
      }
    }

    return result
  }

  const getUnitById = (unitOrId: string | CheckersGameUnit): CheckersGameUnit => {
    const unit = typeof unitOrId === 'string' ? units.find(x => x.id === unitOrId) : unitOrId
    if (!unit)
      throw new Error(`Unit ${unitOrId} is not found`)

    return unit
  }

  const possibleMovesForUnit = (unitOrId: string): GameMoveResult[] => {
    const unit = getUnitById(unitOrId)

    if (unit.player !== currentPlayer())
      throw new Error(`It's not player ${unit.player} turn`)

    const att = attackers()
    if (att.length > 0 && att.find(x => x.id === unit.id) === undefined)
      throw new Error(`Cant move with ${unit.id}, should attack with: ${att[0].id}`)

    const id = nextMoveId()

    const possibleMoves = att.length > 0
      ? possibleAttackMovesForUnit(unit)
      : diagonals(unit.pos, 1, !unit.king ? playerDirectionY(unit.player) : undefined)
        .filter(x => x.length && isEmpty(x))
        .map(x => ({ to: x, id, unitId: unit.id, player: unit.player }))

    if (possibleMoves.length === 0)
      throw new Error(`Can\'t move unit ${unit.id}`)


    return possibleMoves.map(x => {
      if (unit.king)
        return x
      const king = positionToXY(x.to)[1] === (unit.player === 'A' ? 0 : 7)
      return { ...x, king }
    })
  }

  const isAttackerUnit = (unit?: CheckersGameUnit) => unit && possibleAttackMovesForUnit(unit).length > 0
  const attackers = () => {
    const cp = currentPlayer()
    return units.filter(u => isAttackerUnit(u) && u.player === cp)
  }
  const lastMoveUnit = () => getUnitAtPos(lastMove()?.to)

  const moveContinuationUnit = () => {
    const move = lastMove()
    if (move?.king === true)
      return undefined

    const unit = getUnitAtPos(move?.to)
    return (move?.killed && isAttackerUnit(unit) && unit) || undefined
  }

  const currentPlayer = () =>
    moveContinuationUnit()?.player ?? ((lastMoveUnit()?.player ?? 'B') === 'B' ? 'A' : 'B') as AorB

  const move = (move: GameMove) => {
    const unit = getUnitById(move.unitId)
    const possibleMoves = possibleMovesForUnit(move.unitId)
    const found = possibleMoves.find(pm => pm.to === move.to)
    
    if (!found || !unit)
      throw new Error(`Move ${printMove(move)} not valid`)

    return createCheckersGameState({
      moves: [...moves, found],
      units: units
        .map(u => {
          if (u.id === found.killed)
            return undefined
          return u.id === unit.id
            ? { ...u, pos: found.to, king: u.king || (found.king ?? false) }
            : { ...u }
        })
        .filter(x => x !== undefined) as CheckersGameUnit[]
    })
  }

  return {
    units,
    moves,
    possibleMovesForUnit,
    getUnitAtPos,
    isEmpty,
    move,
    nextMoveId,
    lastMove,
    currentPlayer,
    unitsThatShouldAttack: attackers,
  }
}


// const testMovesSequence = (moves: GameMove[]) => {
//   const initialState = initialCheckersGameState(8)

//   const finalState = moves.reduce((s, m) => {

//     const r = s.move(m)
//     if (!r) {
//       console.log('Failed move: ', m)
//       throw new Error()
//     }

//     return r

//   }, initialState)


//   console.log('lastMove', finalState.lastMove())
//   //console.log('DONE', finalState.movesCount())

// }

// testMovesSequence([
//   { from: 'G3' as Position, to: 'F4' as Position, id: 0 },
//   { from: 'F6' as Position, to: 'G5' as Position, id: 1 },
//   { from: 'A3' as Position, to: 'B4' as Position, id: 2 },
//   //{ from: 'B4' as Position, to: 'C5' as Position, id: 1 },
//   { from: 'D6' as Position, to: 'C5' as Position, id: 3 },
//   { from: 'B4' as Position, to: 'D6' as Position, id: 4 },
//   { from: 'C7' as Position, to: 'E5' as Position, id: 5 },
//   //{ from: 'F4' as Position, to: 'D6' as Position, id: 6 },
//   { from: 'E5' as Position, to: 'G3' as Position, id: 6 },
//   { from: 'F2' as Position, to: 'H4' as Position, id: 7 },
//   { from: 'H4' as Position, to: 'F6' as Position, id: 8 },
// ])
