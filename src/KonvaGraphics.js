import React from 'react'
import {Stage, Layer, Circle, Line} from 'react-konva'

import {getTangents} from './calculator'

export const KonvaGraphics = ({pulleys, onPulleySelect, selectedPulleyId}) => {
  return (
    <Stage width={800} height={600}>
      <Layer>
        {pulleys.map((pulley, pulleyIndex) => {
          const notFirstPulley = pulleyIndex > 0
          const circle = (
            <Circle
              id={pulley.id}
              x={pulley.x}
              y={pulley.y}
              radius={pulley.radius}
              stroke={pulley.id === selectedPulleyId ? 'red' : 'gray'}
              draggable
              onClick={e => onPulleySelect(e.target.attrs.id)}
            />
          )
          const lines = []

          if(notFirstPulley) {
            const lastPulley = pulleys[pulleyIndex - 1]
            const tangents = getTangents(lastPulley, pulley)

            lines.push(
              <Line
                key={pulley.id + 'left'}
                points={[tangents.L1.x, tangents.L1.y, tangents.L2.x, tangents.L2.y]}
                stroke="#888"
              />
            )

            lines.push(
             <Line
               key={pulley.id + 'right'}
               points={[tangents.R1.x, tangents.R1.y, tangents.R2.x, tangents.R2.y]}
               stroke="#888"
             />
            )
          }

          return (
            <React.Fragment>
              {circle}
              {lines}
            </React.Fragment>
          )
        })}
      </Layer>
    </Stage>
  )
}
