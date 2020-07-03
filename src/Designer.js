import React from 'react'
import {Stage, Layer} from 'react-konva'

export const Designer = ({conveyor}) => (
  <Stage
    width={1200}
    height={800}
  >
    <Layer>
      {conveyor.parts.map(part => part.draw())}
    </Layer>
  </Stage>
)
