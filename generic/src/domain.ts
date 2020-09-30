
export const xAxis = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const
export const yAxis = ['1', '2', '3', '4', '5', '6', '7', '8'] as const

export type xAxisType = typeof xAxis[number]
export type yAxisType = typeof yAxis[number]

export type Position = [xAxisType, yAxisType] & string
export type UnitId = string

export type AorB = 'A' | 'B'

export type GameMove = {
  id: number
  unitId: string
  to: Position
}

export type RenderParams = {
  renderSize: number
  boardSize: number
  margin: number
}