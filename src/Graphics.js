import React from 'react'
import * as PIXI from 'pixi.js'

import {getTangents} from './calculator'

const pixiApp = new PIXI.Application({
  antialias: true,
  backgroundColor: 0xffffff,
})
window.pixiApp = pixiApp

export const Graphics = ({pulleys}) => {
  console.log('outside', pulleys)
  const canvasContainer = React.createRef()

  pulleys.forEach((pulley, pulleyIndex) => {
    const circle = new PIXI.Graphics()
    const notFirstPulley = pulleyIndex > 0

    circle.lineStyle(2, 0x888888)
      .beginFill(0xffffff)
      .drawCircle(pulley.x, pulley.y, pulley.radius)

    pixiApp.stage.addChild(circle)

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
    console.log('inside', pulleys)
    canvasContainer.current.appendChild(pixiApp.view)
  }, [])

  return (
    <div id="CanvasContainer" ref={canvasContainer}></div>
  )
}
