import React from 'react'
import {Stage, Layer, Circle, Line, Shape} from 'react-konva'

import {getTangentOfPointAndCircle1, getTangentOfPointAndCircle2} from './calculator'
import {Point} from './Point'
import {uuid} from './uuid'

export const KonvaGraphics = ({pulleys, points, onPulleySelect, selectedPulleyId, isAddingPoint, addPoint}) => {
  return (
    <Stage
      className={isAddingPoint ? 'isAddingPoint' : ''}
      width={800}
      height={600}
      onClick={stage => isAddingPoint && addPoint(stage.evt.layerX, stage.evt.layerY)}
    >
      <Layer>
        <Circle
          id="pulley1"
          x={150}
          y={300}
          radius={50}
          stroke="#888"
          fill="#eee"
          shadowBlur={6}
          shadowOpacity={0.3}
        />
        <Circle
          id="pulley2"
          x={650}
          y={300}
          radius={50}
          stroke="#888"
          fill="#eee"
          shadowBlur={6}
          shadowOpacity={0.3}
        />
        <Shape
          sceneFunc={(context, shape) => {
            context.beginPath()
            context.moveTo(150, 290)
            context.lineTo(150, 310)
            context.moveTo(140, 300)
            context.lineTo(160, 300)
            context.fillStrokeShape(shape);
          }}
          stroke="#f66"
          strokeWidth={1}
        />
        <Shape
          sceneFunc={(context, shape) => {
            context.beginPath()
            context.moveTo(650, 290)
            context.lineTo(650, 310)
            context.moveTo(640, 300)
            context.lineTo(660, 300)
            context.fillStrokeShape(shape);
          }}
          stroke="#f66"
          strokeWidth={1}
        />
        <Line
          points={[150, 350, 650, 350]}
          stroke="#888"
        />
        {points.length === 0 && (
          <Line
            points={[150, 250, 650, 250]}
            stroke="#888"
          />
        )}
{/*
        {pulleys.map((pulley, pulleyIndex) => {
          const notFirstPulley = pulleyIndex > 0
          const circle = (
            <Circle
              key={pulley.id}
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
                key={uuid()}
                points={[tangents.L1.x, tangents.L1.y, tangents.L2.x, tangents.L2.y]}
                stroke="#888"
              />
            )

            lines.push(
             <Line
               key={uuid()}
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
*/}
        {points.map((point, pointIndex) => {
          const isFirstPoint = pointIndex === 0
          const isLastPoint = pointIndex === points.length -1
          const pointComponent = (
            <Point
              id={point.id}
              x={point.x}
              y={point.y}
            />
          )
          const lines = []

          if(isFirstPoint) {
            const tangents = getTangentOfPointAndCircle1(point, {x: 150, y: 300, radius: 50})

            lines.push(
              <Line
                points={[tangents.x, tangents.y, point.x, point.y]}
                stroke="#888"
              />
            )
          }
          else {
            const previousPoint = points[pointIndex - 1]

            lines.push(
              <Line
                points={[previousPoint.x, previousPoint.y, point.x, point.y]}
                stroke="#888"
              />
            )
          }

          if(isLastPoint) {
            const tangents = getTangentOfPointAndCircle2(point, {x: 650, y: 300, radius: 50})

            lines.push(
              <Line
                points={[point.x, point.y, tangents.x, tangents.y]}
                stroke="#888"
              />
            )
          }
          else if(!isFirstPoint) {
            const nextPoint = points[pointIndex + 1]

            lines.push(
              <Line
                points={[point.x, point.y, nextPoint.x, nextPoint.y]}
                stroke="#888"
              />
            )
          }

          /*if(notFirstPoint) {
            const previousPoint = points[pointIndex - 1]

            lineComponent = (
              <Line
                points={[previousPoint.x, previousPoint.y, point.x, point.y]}
                stroke="#888"
              />
            )

          }
          else {
            lineComponent = (
              <Line
                points={[150, 250, point.x, point.y]}
                stroke="#888"
              />
            )
          }*/

          return (
            <React.Fragment>
              {lines}
              {pointComponent}
            </React.Fragment>
          )
        })}
      </Layer>
    </Stage>
  )
}
