import React from 'react'
import {Rect} from 'react-konva'
import Konva from 'konva'

export const ColoredRect = () => {
  const [color, setColor] = React.useState('green')
  const onClick = () => {
    setColor(Konva.Util.getRandomColor())
  }
  console.log(color)
  return (
    <Rect
      x={20}
      y={20}
      width={50}
      height={50}
      fill={color}
      onClick={onClick}
    />
  )
}
