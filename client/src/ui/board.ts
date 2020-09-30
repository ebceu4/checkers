import { CheckersGame, Position, RenderParams, xyToPosition } from '@checkers/generic'
import { Rect, Svg, Text } from '@svgdotjs/svg.js'

export type BoardCell = { pos: Position, rect: Rect }

type createBoardParams = {
  svg: Svg
  boardSize: number
  onMouseOver?: (boardCell: BoardCell) => void
  onMouseOut?: (boardCell: BoardCell) => void
  onClick?: (boardCell: BoardCell) => void
}

export const createBoard = ({ svg, boardSize, onMouseOver, onMouseOut, onClick }: createBoardParams) => {

  const board: Record<string, BoardCell> = {}
  const labels: Record<string, Text> = {}
  let _margin = 0

  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {

      const isDark = (x + y) % 2 !== 0

      const pos = xyToPosition(x, y)
      const rect = svg
        .rect(0, 0)
        .addClass('boardCell')
        .addClass(isDark ? 'dark' : 'light')

      const cell = { pos, rect }
      board[pos] = cell

      rect.attr({ pos })
        .mouseover(() => {
          onMouseOver && onMouseOver(cell)
        })
        .mouseout(() => {
          onMouseOut && onMouseOut(cell)
        })
        .click(() => {
          onClick && onClick(cell)
        })
    }
  }

  for (let x = 0; x < boardSize; x++) {
    const labelX = xyToPosition(x, 0)[0]
    const labelY = xyToPosition(0, x)[1]
    labels[`${labelX}B`] = svg
      .text(labelX)
    labels[`${labelX}T`] = svg
      .text(labelX)

    labels[`${labelY}L`] = svg
      .text(labelY)
    labels[`${labelY}R`] = svg
      .text(labelY)
  }

  const allCells = () =>
    Object.keys(board).map(k => board[k])

  const getCell = (pos: Position): BoardCell =>
    board[pos]

  const resize = ({ renderSize, margin }: RenderParams) => {
    _margin = renderSize * margin

    const s = renderSize - _margin * 2

    const lPerUnit = s / boardSize

    for (let x = 0; x < boardSize; x++) {
      for (let y = 0; y < boardSize; y++) {
        const pos = xyToPosition(x, y)
        const { rect } = board[pos]
        rect
          .size(lPerUnit, lPerUnit)
          .move(_margin + x * lPerUnit, _margin + y * lPerUnit)
      }

      const labelX = xyToPosition(x, 0)[0]
      const labelY = xyToPosition(0, x)[1]
      labels[`${labelX}B`]
        .center(_margin + x * lPerUnit + lPerUnit / 2, _margin + (boardSize - 0.3) * lPerUnit + lPerUnit / 2)
      labels[`${labelX}T`]
        .center(_margin + x * lPerUnit + lPerUnit / 2, _margin + -0.7 * lPerUnit + lPerUnit / 2)

      labels[`${labelY}L`]
        .center(_margin - 0.7 * lPerUnit + lPerUnit / 2, _margin + x * lPerUnit + lPerUnit / 2)
      labels[`${labelY}R`]
        .center(_margin + (boardSize - 0.3) * lPerUnit + lPerUnit / 2, _margin + x * lPerUnit + lPerUnit / 2)

    }
  }

  const removeClass = (className: string) => {
    allCells().forEach(c => {
      c.rect.removeClass(className)
    })
  }

  return {
    resize,
    getCell,
    removeClass,
  }
}