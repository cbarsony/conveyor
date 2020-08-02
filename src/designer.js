import {getTangents} from './utils/calculator'

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
}