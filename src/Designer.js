import React from 'react'
import {Stage, Layer, Circle, Line} from 'react-konva'

import {getTangents, getDistanceOfSectionAndPoint} from './calculator'

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

export const Designer = ({pulleys, onPulleyMove, onPulleyDrop, dropItem}) => {
  const [PulleyDropPoint, setPulleyDropLocation] = React.useState({x: 0, y: 0})
  const [selectedPulleyIndex, setSelectedPartIndex] = React.useState(null)

  return (
    <Stage
      width={1200}
      height={600}
      draggable
      onMouseMove={({evt}) => {
        if(dropItem) {
          let resultPulleyIndex = 0
          let smallestDistance = Number.MAX_SAFE_INTEGER
          let beltSectionMiddlePoint = {x: 0, y: 0}

          pulleys.forEach((pulley, pulleyIndex) => {
            const nextPulley = pulleyIndex === pulleys.length - 1 ? pulleys[0] : pulleys[pulleyIndex + 1]
            const tangents = getTangents(pulley, nextPulley)
            const distance = getDistanceOfSectionAndPoint([
              {x: tangents.start.x, y: tangents.start.y},
              {x: tangents.end.x, y: tangents.end.y},
            ], {x: evt.layerX, y: evt.layerY})

            if(distance < smallestDistance) {
              smallestDistance = distance
              resultPulleyIndex = pulleyIndex

              beltSectionMiddlePoint = {
                x: (tangents.start.x + tangents.end.x) / 2,
                y: (tangents.start.y + tangents.end.y) / 2,
              }
            }
          })

          setPulleyDropLocation(beltSectionMiddlePoint)
          setSelectedPartIndex(resultPulleyIndex)
        }
      }}
      onClick={() => {
        if(dropItem) {
          onPulleyDrop(PulleyDropPoint, selectedPulleyIndex)
        }
      }}
    >
      <Layer>
        {dropItem && PulleyDropPoint !== null && (
          <Circle
            x={PulleyDropPoint.x}
            y={PulleyDropPoint.y}
            radius={20}
            stroke="#888"
            fill="#eee"
            shadowBlur={6}
            shadowOpacity={0.3}
          />
        )}
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