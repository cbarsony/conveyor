import React from 'react'
import Konva from 'konva'

import {getTangents} from './calculator'

export const Designer = ({pulleys, selectedPulleyId, setSelectedPulleyId}) => {
  React.useEffect(() =>     {
      const stage = new Konva.Stage({
        container: 'Designer',
        width: 1200,
        height: 600,
      })
      const layer = new Konva.Layer()

      /*stage.on('click', () => {
       if(selectedPulleyId !== null) {
       const prevSelectedPulley = stage.findOne(`#${selectedPulleyId}`)
       prevSelectedPulley.setAttr('fill', pulleyFillColor)
       selectedPulleyId = null

       layer.draw()
       }
       })*/

      pulleys.forEach((pulley, pulleyIndex) => {
        const nextPulley = pulleyIndex === pulleys.length - 1 ? pulleys[0] : pulleys[pulleyIndex + 1]
        const prevPulley = pulleyIndex === 0 ? pulleys[pulleys.length - 1] : pulleys[pulleyIndex - 1]
        const tangents = getTangents(pulley, nextPulley)

        const pulleyGeometry = new Konva.Circle({
          nextPulleyId: nextPulley.id,
          prevPulleyId: prevPulley.id,
          id: pulley.id,
          x: pulley.x,
          y: pulley.y,
          radius: pulley.radius,
          fill: '#eee',
          stroke: '#888',
          shadowForStrokeEnabled: false,
          draggable: true,
        })

        pulleyGeometry.on('click', ({target}) => {
          if(selectedPulleyId !== null) {
            const prevSelectedPulley = stage.findOne(`#${selectedPulleyId}`)
            prevSelectedPulley.setAttr('fill', '#eee')
          }
          const selectedPulley = stage.findOne(`#${target.attrs.id}`)
          selectedPulley.setAttr('fill', '#e00')

          layer.draw()
          setSelectedPulleyId(target.attrs.id)
        })

        pulleyGeometry.on('dragend', ({target}) => {
          const pulley = stage.findOne(`#${target.attrs.id}`)
          const pulleyPosition = pulley.getPosition()

          const nextPulley = stage.findOne(`#${target.attrs.nextPulleyId}`)
          const nextPulleyPosition = nextPulley.getPosition()

          const prevPulley = stage.findOne(`#${target.attrs.prevPulleyId}`)
          const prevPulleyPosition = prevPulley.getPosition()

          const prevLine = stage.findOne(`#belt_${prevPulley.attrs.id}`)
          const prevLineTangents = getTangents({
            x: prevPulleyPosition.x,
            y: prevPulleyPosition.y,
            radius: prevPulley.getRadius(),
          }, {
            x: pulleyPosition.x,
            y: pulleyPosition.y,
            radius: pulley.getRadius(),
          })
          prevLine.setAttr('points', [prevLineTangents.start.x, prevLineTangents.start.y, prevLineTangents.end.x, prevLineTangents.end.y,])

          const nextLine = stage.findOne(`#belt_${pulley.attrs.id}`)
          const nextLineTangents = getTangents({
            x: pulleyPosition.x,
            y: pulleyPosition.y,
            radius: pulley.getRadius(),
          }, {
            x: nextPulleyPosition.x,
            y: nextPulleyPosition.y,
            radius: nextPulley.getRadius(),
          })
          nextLine.setAttr('points', [nextLineTangents.start.x, nextLineTangents.start.y, nextLineTangents.end.x, nextLineTangents.end.y,])

          layer.draw()
        })

        const line = new Konva.Line({
          id: `belt_${pulley.id}`,
          points: [
            tangents.start.x,
            tangents.start.y,
            tangents.end.x,
            tangents.end.y,
          ],
          stroke: '#888',
          shadowForStrokeEnabled: false,
        })

        layer.add(pulleyGeometry)
        layer.add(line)
      })

      stage.add(layer)
      layer.draw()
    }
    , [])

  return (
    <div id="Designer"></div>
  )
}

/*
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
            shadowForStrokeEnabled={false}
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
*/
