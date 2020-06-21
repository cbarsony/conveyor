import React from 'react'
import * as PIXI from 'pixi.js'

import {getTangents} from './calculator'

const pixiApp = new PIXI.Application({
  antialias: true,
  backgroundColor: 0xffffff,
})
window.pixiApp = pixiApp

export const PixiGraphics = ({pulleys}) => {
  const canvasContainer = React.createRef()

  function onMouseDown() {
    this.alpha = 0.5
    this.dragging = true
  }

  function onMouseUp() {
    this.alpha = 1
    this.dragging = false
  }

  function onMouseMove(e) {
    if(this.dragging) {
      const newPosition = e.data.getLocalPosition(this)
      this.position.x = newPosition.x
      this.position.y = newPosition.y
    }
  }

  pulleys.forEach((pulley, pulleyIndex) => {
    const notFirstPulley = pulleyIndex > 0
    const circle = new PIXI.Graphics()
    circle.lineStyle(2, 0x888888)
      .beginFill(0xaaaaaa)
      .drawCircle(pulley.x, pulley.y, pulley.radius)
      .endFill()

    const x = pixiApp.renderer.generateTexture(circle)

    const texture = new PIXI.Sprite(x)

    texture.interactive = true
    texture.buttonMode = true
    texture
      .on('mousedown', onMouseDown)
      .on('mouseup', onMouseUp)
      .on('mousemove', onMouseMove)



    pixiApp.stage.addChild(texture)

    if(notFirstPulley) {
      const lastPulley = pulleys[pulleyIndex - 1]
      const centerLine = new PIXI.Graphics()
      const leftTangentLine = new PIXI.Graphics()
      const rightTangentLine = new PIXI.Graphics()
      const tangents = getTangents(lastPulley, pulley)

      centerLine.position.set(lastPulley.x, lastPulley.y)
      centerLine.lineStyle(2, 0xcccccc).lineTo(pulley.x - lastPulley.x, pulley.y - lastPulley.y)

      leftTangentLine.position.set(tangents.L1.x, tangents.L1.y)
      leftTangentLine.lineStyle(2, 0x880000).lineTo(tangents.L2.x - tangents.L1.x, tangents.L2.y - tangents.L1.y)
      
      rightTangentLine.position.set(tangents.R1.x, tangents.R1.y)
      rightTangentLine.lineStyle(2, 0x000088).lineTo(tangents.R2.x - tangents.R1.x, tangents.R2.y - tangents.R1.y)

      // pixiApp.stage.addChild(centerLine)
      pixiApp.stage.addChild(leftTangentLine)
      pixiApp.stage.addChild(rightTangentLine)
    }
  })

  React.useEffect(() => {
    canvasContainer.current.appendChild(pixiApp.view)
  }, [])

  return (
    <div id="CanvasContainer" ref={canvasContainer}></div>
  )
}
