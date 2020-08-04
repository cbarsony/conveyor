// import Konva from 'konva'

import {getTangents} from './utils/calculator'
// import {ROTATION} from './utils/types'
// import {uuid} from './utils/uuid'

export const designer = {
  changePulleyAttribute: (id, attributeName, attributeValue) => {
    const stage = window.Konva.stages[0]
    stage.findOne(`#${id}`).setAttr(attributeName, attributeValue)
    designer.drawBeltsAfterPulleyPositionChange(id)
  },

  drawBeltsAfterPulleyPositionChange: (id) => {
    const stage = window.Konva.stages[0]
    const pulley = stage.findOne(`#${id}`)
    const pulleyPosition = pulley.getPosition()

    const nextPulley = stage.findOne(`#${pulley.attrs.data.nextPulleyId}`)
    const nextPulleyPosition = nextPulley.getPosition()

    const prevPulley = stage.findOne(`#${pulley.attrs.data.prevPulleyId}`)
    const prevPulleyPosition = prevPulley.getPosition()

    const prevLine = stage.findOne(`#belt_${prevPulley.attrs.id}`)
    const prevLineTangents = getTangents({
      x: prevPulleyPosition.x,
      y: prevPulleyPosition.y,
      radius: prevPulley.getRadius(),
      rotation: prevPulley.attrs.data.rotation,
    }, {
      x: pulleyPosition.x,
      y: pulleyPosition.y,
      radius: pulley.getRadius(),
      rotation: pulley.attrs.data.rotation,
    })
    prevLine.setAttr('points', [prevLineTangents.start.x, prevLineTangents.start.y, prevLineTangents.end.x, prevLineTangents.end.y,])

    const nextLine = stage.findOne(`#belt_${pulley.attrs.id}`)
    const nextLineTangents = getTangents({
      x: pulleyPosition.x,
      y: pulleyPosition.y,
      radius: pulley.getRadius(),
      rotation: pulley.attrs.data.rotation,
    }, {
      x: nextPulleyPosition.x,
      y: nextPulleyPosition.y,
      radius: nextPulley.getRadius(),
      rotation: nextPulley.attrs.data.rotation,
    })
    nextLine.setAttr('points', [nextLineTangents.start.x, nextLineTangents.start.y, nextLineTangents.end.x, nextLineTangents.end.y,])

    stage.children[0].draw()
  },

/*  dropPulley: (id, dropPoint) => {
    const stage = window.Konva.stages[0]
    const oldBelt = stage.findOne(`#belt_${id}`)
    const prevPulley = stage.findOne(`#${id}`)
    const nextPulley = stage.findOne(`#${prevPulley.attrs.data.nextPulleyId}`)
    const newPulleyId = uuid()
    const newPulley = new Konva.Circle({
      data: {
        nextPulleyId: prevPulley.attrs.id,
        prevPulleyId: prevPulley.attrs.data.nextPulleyId,
        rotation: ROTATION.CLOCKWISE,
      },
      id: newPulleyId,
      x: dropPoint.x,
      y: dropPoint.y,
      radius: 20,
      fill: '#eee',
      stroke: '#888',
      shadowForStrokeEnabled: false,
      draggable: true,
    })

    const prevPulleyPosition = prevPulley.getPosition()
    const newPulleyPosition = newPulley.getPosition()
    const nextPulleyPosition = nextPulley.getPosition()

    const prevLineTangents = getTangents({
      x: prevPulleyPosition.x,
      y: prevPulleyPosition.y,
      radius: prevPulley.getRadius(),
      rotation: prevPulley.attrs.data.rotation,
    }, {
      x: newPulleyPosition.x,
      y: newPulleyPosition.y,
      radius: newPulley.getRadius(),
      rotation: newPulley.attrs.data.rotation,
    })

    const nextLineTangents = getTangents({
      x: newPulleyPosition.x,
      y: newPulleyPosition.y,
      radius: newPulley.getRadius(),
      rotation: newPulley.attrs.data.rotation,
    }, {
      x: nextPulleyPosition.x,
      y: nextPulleyPosition.y,
      radius: nextPulley.getRadius(),
      rotation: nextPulley.attrs.data.rotation,
    })

    const prevLine = new Konva.Line({
      id: `belt_${prevPulley.attrs.id}`,
      points: [
        prevLineTangents.start.x,
        prevLineTangents.start.y,
        prevLineTangents.end.x,
        prevLineTangents.end.y,
      ],
      stroke: '#888',
      shadowForStrokeEnabled: false,
    })

    const nextLine = new Konva.Line({
      id: `belt_${newPulley.attrs.id}`,
      points: [
        nextLineTangents.start.x,
        nextLineTangents.start.y,
        nextLineTangents.end.x,
        nextLineTangents.end.y,
      ],
      stroke: '#888',
      shadowForStrokeEnabled: false,
    })

    oldBelt.destroy()

    stage.children[0].add(newPulley)
    stage.children[0].add(prevLine)
    stage.children[0].add(nextLine)
    stage.children[0].draw()

    return newPulleyId
  }*/
}