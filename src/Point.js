import React from 'react'
import {Shape} from 'react-konva'

export const Point = ({id, x, y}) => {
  return (
    <Shape
      key={id}
      sceneFunc={(context, shape) => {
        context.beginPath()
        context.moveTo(x, y - 10)
        context.lineTo(x, y + 10)
        context.moveTo(x - 10, y)
        context.lineTo(x + 10, y)
        context.fillStrokeShape(shape);
      }}
      stroke="black"
      strokeWidth={2}
    />
  )
}