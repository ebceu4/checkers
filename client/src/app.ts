import { AorB, createCheckersGame, parseMoves } from '@checkers/generic'
import { Svg, SVG } from '@svgdotjs/svg.js'
import { createClient } from './client'
import { ILogger, INotifier } from './types'
import { createGameUI } from './ui/ui'

type createAppParams = {
  wsUri: string
  token: string
  logger: ILogger
  notifier: INotifier
  window: Window
}

export const createApp = ({ wsUri, token, logger, notifier, window }: createAppParams) => {
  const svg = SVG('.root') as Svg
  const boardSize = 8
  const client = createClient({
    wsUri,
    token,
    logger,
  })

  const game = createCheckersGame({ boardSize })
  const gameUI = createGameUI({
    window, game, svg, logger, notifier,
    onMoveSelected: ({ unitId, to }) => {
      const move = game.move(unitId, to)
      gameUI.showLastMove()
      client.emit('move', { id: move.id, unitId: move.unitId, to: move.to })
    }
  })

  client.on('handshake', ({ data, moves, player }) => {
    if (moves === undefined) {
      logger.info('No moves on handshake')
      return
    }

    if (player === 'B') {
      document.body.style.setProperty('--boardRotation', '180deg');
    }

    try {
      const units = game.loadMoves(moves)
      gameUI.loadGame(units, player)
    } catch (error) {
      logger.info(error.message)
    }

  })

  client.on('move', ({ unitId, to }) => {
    const moveResult = game.move(unitId, to)
    gameUI.showLastMove()
  })

}