import { CheckersGameUnit, Position, positionToXY, RenderParams } from '@checkers/generic'
import { Element, Ellipse, Runner, Svg, Text } from '@svgdotjs/svg.js'

export type Unit = { unitId: string, pos: Position, elements: [Ellipse, Text, Element | undefined] }

type UnitsRenderParams = RenderParams & { unitMargin: number }

type createUnitsParams = {
  svg: Svg
  boardSize: number
  units: CheckersGameUnit[]
  options?: { showUnitLabels?: boolean }
  onMouseOver?: (boardCell: Unit) => void
  onMouseOut?: (boardCell: Unit) => void
  onClick?: (boardCell: Unit) => void
}

export const createUnits = ({ svg, boardSize, units, options, onMouseOver, onMouseOut, onClick }: createUnitsParams) => {

  const kingMargin = 0.5
  const _units: Record<string, Unit> = {}

  units.forEach(gameUnit => {

    const ellipse = svg
      .ellipse(0, 0)
      .attr({ style: 'opacity: 1' })
    const text = svg.text(gameUnit.id)
      .attr({ style: `pointer-events: none; opacity: ${options?.showUnitLabels ? '1' : '0'};` })

    let kingElement = undefined
    if (gameUnit.king)
      kingElement = svg.use('king')
        .attr({ style: 'opacity: 1' })

    const unit = {
      unitId: gameUnit.id,
      pos: gameUnit.pos,
      elements: [
        ellipse,
        text,
        kingElement,
      ] as [Ellipse, Text, Element | undefined]
    }



    ellipse.addClass('boardUnit')
      .addClass(gameUnit.player === 'A' ? 'light' : 'dark')
      .mouseover(() => {
        onMouseOver && onMouseOver(unit)
      })
      .mouseout(() => {
        onMouseOut && onMouseOut(unit)
      })
      .click(() => {
        onClick && onClick(unit)
      })

    _units[gameUnit.id] = unit
  })

  const positionToSvgCoordsCenter = (pos: Position) => {
    const [x, y] = positionToXY(pos)
    return [_margin + _unitMargin + _lPerUnit / 2 + x * (_lPerUnit + _unitMargin * 2), _margin + _unitMargin + _lPerUnit / 2 + y * (_lPerUnit + _unitMargin * 2)]
  }

  let _margin = 0
  let _unitMargin = 0
  let _lPerUnit = 0

  const resize = ({ renderSize, margin, unitMargin }: UnitsRenderParams) => {
    _margin = renderSize * margin

    const s = renderSize - _margin * 2
    _unitMargin = (s / boardSize) * unitMargin
    _lPerUnit = s / boardSize - _unitMargin * 2


    Object.keys(_units).forEach(key => {
      const { pos, elements: [ellipse, text, king] } = _units[key]
      const [x, y] = positionToSvgCoordsCenter(pos)
      ellipse
        .size(_lPerUnit, _lPerUnit)
        .center(x, y)
      text
        .center(x, y)
      king
        ?.size(_lPerUnit * kingMargin, _lPerUnit * kingMargin)
        ?.center(x, y)
    })
  }

  const animateMove = (id: string, to: Position, isKing = false, isAttack = false) => {
    const [x, y] = positionToSvgCoordsCenter(to)
    const duration = isAttack ? 300 : 150

    const animateAttack = (runner?: Runner) => isAttack && runner
      ? runner
        .animate(duration / 2, 0, 'now')
        .transform({ scale: 2, origin: [x - 100, y] })
        .animate(duration / 2, 0, 'after')
        .transform({ scale: 1 })
      : runner

    const elements = _units[id].elements

    const a = elements.map(e => animateAttack(e
      ?.front()
      ?.animate({ duration, ease: '<>' })
      ?.center(x, y)))

    a[0]!.after(() => {
      if (isKing) {
        const e = elements[0]
        const w = e.width()
        const h = e.height()
        const x = e.cx()
        const y = e.cy()
        if (!elements[2])
          elements[2] = svg.use('king')
            .attr({ style: 'opacity: 1' })
            .size(w * kingMargin, h * kingMargin)
            .center(x, y)
      }
    })
  }

  const animateDeath = (id: string) => {
    _units[id].elements.map(e => e
      ?.animate({ duration: 300, ease: '<>' })
      ?.delay(100)
      ?.transform({ scale: 1.1 })
      ?.css({ opacity: 0 })
    )[0]!.after(() => {
      _units[id].elements.map(e => e && svg.removeElement(e))
      delete _units[id]
    })
  }

  const getUnitById = (id: string) => _units[id]

  const destroy = () => {
    Object.keys(_units).forEach(k => {
      _units[k]!.elements.forEach(e => {
        if (e) {
          e.remove()
        }
      })
    })
  }

  return {
    resize,
    animateMove,
    animateDeath,
    getUnitById,
    destroy,
  }
}
