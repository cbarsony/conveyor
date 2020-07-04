import React from 'react'
import {Stage, Layer, Circle} from 'react-konva'

import {FreeBeltSection} from './model'
import {getDistanceOfSectionAndPoint} from './calculator'

export const Designer = ({conveyor, dropItem, onPulleyDrop, onPulleyMove}) => {
  const [pulleyDropLocation, setPulleyDropLocation] = React.useState({x: 0, y: 0})
  const [selectedPartIndex, setSelectedPartIndex] = React.useState(null)

  return (
    <Stage
      width={1200}
      height={800}
      onMouseMove={({evt}) => {
        if(dropItem) {
          let resultPartIndex = 0
          let smallestDistance = Number.MAX_SAFE_INTEGER
          conveyor.parts.forEach((part, partIndex) => {
            if(part instanceof FreeBeltSection) {
              const distance = getDistanceOfSectionAndPoint([
                {x: part.location.x, y: part.location.y},
                {x: part.endLocation.x, y: part.endLocation.y},
              ], {x: evt.layerX, y: evt.layerY})

              if(distance < smallestDistance) {
                smallestDistance = distance
                resultPartIndex = partIndex
              }
            }
          })
          const beltSection = conveyor.parts[resultPartIndex]
          const beltSectionMiddlePoint = {
            x: (beltSection.location.x + beltSection.endLocation.x) / 2,
            y: (beltSection.location.y + beltSection.endLocation.y) / 2,
          }
          setPulleyDropLocation(beltSectionMiddlePoint)
          setSelectedPartIndex(resultPartIndex)
        }
      }}
      onClick={() => {
        if(dropItem) {
          onPulleyDrop(pulleyDropLocation, selectedPartIndex)
        }
      }}
      onDragEnd={({evt, target}) => {
        onPulleyMove(target.attrs.id, {x: evt.layerX, y: evt.layerY})
      }}
    >
      <Layer>
        {conveyor.parts.map(part => part.draw())}
        {dropItem && pulleyDropLocation !== null && (
          <Circle
            x={pulleyDropLocation.x}
            y={pulleyDropLocation.y}
            radius={20}
            stroke="#888"
            fill="#eee"
            shadowBlur={6}
            shadowOpacity={0.3}
          />
        )}
      </Layer>
    </Stage>
  )
}