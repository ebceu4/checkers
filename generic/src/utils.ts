import { AorB, GameMove, Position, xAxis, yAxis } from './domain'

const size = 8

export const inBounds = (x: number, y: number) => x >= 0 && x < size && y >= 0 && y < size

export const positionToXY = (pos: Position) => {
  const [x, y] = pos
  return [x.charCodeAt(0) - 65, size - parseInt(y)]
}

export const validPosition = (pos: Position) => {
  const [x, y] = positionToXY(pos)
  return inBounds(x, y)
}

export const validUnitId = (unitId: string) => {
  try {
    const index = parseInt(unitId.slice(undefined, -1))
    return index > 0 && index < 13 && (unitId.endsWith('A') || unitId.endsWith('B'))
  } catch {
    return false
  }
}

export const xyToPosition = (x: number, y: number) =>
  xAxis[x] + yAxis[(size - 1) - y] as Position

export const playerDirectionY = (player: AorB) =>
  player === 'A' ? -1 : 1

export const diagonals = (from: Position, distance: number, direction?: number) => {
  const [x, y] = positionToXY(from)

  if (!inBounds(x, y))
    return []

  const positions = (direction
    ?
    [
      [x + 1 * distance, y + direction * distance],
      [x - 1 * distance, y + direction * distance],
    ]
    :
    [
      [x + 1 * distance, y + 1 * distance],
      [x - 1 * distance, y + 1 * distance],
      [x + 1 * distance, y - 1 * distance],
      [x - 1 * distance, y - 1 * distance],
    ]
  )

  return positions.map(([x, y]) => inBounds(x, y) ? xyToPosition(x, y) : '' as Position)
}

export const serializeMoves = (gameMoves: { unitId: string, to: String }[]) => gameMoves.map(x => `${x.unitId}:${x.to}`).join(' ')
export const parseMoves = (data: string) => data.split(' ').map((m, id) => {
  if (!m) return undefined
  const [unitId, to] = m.split(':')

  if (!validUnitId(unitId) || !validPosition(to as Position))
    throw new Error('Invalid moves data')

  return { id, unitId, to } as GameMove
}).filter(x => x !== undefined) as GameMove[]

