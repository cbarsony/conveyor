import React from 'react'
import {Stage, Layer, Circle, Line} from 'react-konva'

import {getTangents} from './calculator'

const Pulley = ({x, y, radius, rotation, onDragEnd}) => (
  <Circle
    draggable
    onDragEnd={e => {
      const x = e.target.x()
      const y = e.target.y()
      onDragEnd(x, y)
    }}
    x={x}
    y={y}
    radius={radius}
    stroke="#888"
    fill="#eee"
    shadowBlur={6}
    shadowOpacity={0.3}
  />
)

const Belt = ({start, end}) => (
  <Line
    points={[
      start.x,
      start.y,
      end.x,
      end.y,
    ]}
    stroke="#888"
  />
)

export const Designer = ({pulleys, onPulleyMove}) => {
  return (
    <Stage
      width={1200}
      height={800}
      draggable
    >
      <Layer>
        {pulleys.map((pulley, pulleyIndex) => {
          const nextPulley = pulleyIndex === pulleys.length - 1 ? pulleys[0] : pulleys[pulleyIndex + 1]
          const tangents = getTangents(pulley, nextPulley)

          return (
            <React.Fragment
              key={pulleyIndex}
            >
              <Pulley
                x={pulley.x}
                y={pulley.y}
                radius={pulley.radius}
                rotation={pulley.rotation}
                onDragEnd={(x, y) => onPulleyMove(pulleyIndex, x, y)}
              />
              <Belt
                start={tangents.start}
                end={tangents.end}
              />
            </React.Fragment>
          )
        })}
      </Layer>
    </Stage>
  )
}