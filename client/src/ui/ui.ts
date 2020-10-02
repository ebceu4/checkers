import { AorB, CheckersGameReadOnly, CheckersGameUnit, GameMove, Position, GameMoveResult } from '@checkers/generic'
import { Svg } from '@svgdotjs/svg.js'
import { ILogger, INotifier } from '../types'
import { createBoard, BoardCell } from './board'
import { createUnits, Unit } from './units'

type createUIParams = {
  svg: Svg
  game: CheckersGameReadOnly
  window: Window
  logger: ILogger
  notifier: INotifier
  onMoveSelected: (gameMove: GameMove) => void
}

export const createGameUI = ({ window, game, svg, logger, notifier, onMoveSelected }: createUIParams) => {

  const boardSize = game.boardSize

  const loadGame = (units: CheckersGameUnit[], player: AorB | 'S') => {
    if (_units) {
      _units.destroy()
    }
    _units = createUnits({ svg, boardSize, units, onClick: onUnitClick })
    _player = player
    update()
  }

  const update = () => {
    const { innerWidth, innerHeight } = window
    const size = Math.min(innerHeight, innerWidth)
    svg.size(size, size)

    const w = svg.width()
    const h = svg.height()

    const params = {
      renderSize: Math.min(w, h),
      boardSize,
      margin: 0.05,
    }
    _board.resize(params)
    if (_units) {
      _units.resize({ ...params, unitMargin: 0.17 })
    }
  }

  const highlightPositions = (positions: Position[]) => {
    _board.removeClass('highlight')
    positions.forEach(p => {
      _board.getCell(p).rect.addClass('highlight')
    })
  }

  const onUnitClick = (unit: Unit) => {
    try {

      if (game.currentPlayer() !== _player)
        throw Error('It\'s not your turn')

      const possibleMoves = game.possibleMovesForUnit(unit.unitId)
      if (possibleMoves.length === 1) {
        _board.removeClass('highlight')
        onMoveSelected(possibleMoves[0])
        return
      }

      _pendingMoves.length = 0
      highlightPositions(possibleMoves.map(x => x.to))
      _pendingMoves.push(...possibleMoves)
    } catch (error) {
      logger.info(error.message)
      notifier.show(error.message)
    }


    // if (possibleMoves.length === 0) {
    //   notifier.show('Can\'t move this unit')
    //   return
    // }

    // if (possibleMoves[0].player !== game.currentPlayer()) {
    //   notifier.show('It\'s not your turn')
    //   return
    // }


  }

  const onBoardClick = (boardCell: BoardCell) => {
    if (_pendingMoves.length === 0)
      return

    const found = _pendingMoves.find(m => m.to === boardCell.pos)
    if (found) {
      _board.removeClass('highlight')
      _pendingMoves.length = 0
      onMoveSelected(found)
    }
  }

  const showLastMove = () => {
    if (!_units)
      throw new Error('Can\'t show move yet. No units initialized.')

    const { unitId, to, killed, king } = game.lastMove()!
    _units.animateMove(unitId, to, king, killed !== undefined)
    killed && _units.animateDeath(killed)
  }

  let _units: ReturnType<typeof createUnits> | null = null
  const _board = createBoard({ svg, boardSize: 8, onClick: onBoardClick })
  let _player: AorB | 'S' = 'S'
  const _pendingMoves: GameMoveResult[] = []


  window.onresize = update
  update()

  return {
    loadGame,
    showLastMove,
  }
}