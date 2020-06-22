import React from 'react'
import _ from 'lodash'

import {KonvaGraphics} from './KonvaGraphics'
import {DataTable} from './DataTable'
import {uuid} from './uuid'

export const App = () => {
  const [pulleys, setPulleys] = React.useState([
    new Pulley(150, 300, 50),
    new Pulley(650, 300, 50),
  ])
  const [points, setPoints] = React.useState([])
  const [isAddingPoint, setAddingPoint] = React.useState(false)
  const [selectedPulleyId, setSelectedPulleyId] = React.useState()
  const onPulleySelect = id => setSelectedPulleyId(id)
  const addPoint = (x, y) => setPoints(points => {
    if(points.length === 0) {
      return [new Point(x, y)]
    }
    else {
      const indexOfFirstPointWithBiggerX = points.findIndex(point => {
        return point.x > x
      })
      if(indexOfFirstPointWithBiggerX === -1) {
        return [...points, new Point(x, y)]
      }
      else {
        points.splice(indexOfFirstPointWithBiggerX, 0, new Point(x, y))
        return _.cloneDeep(points)
      }
    }
  })

  return (
    <div id="App">
      <div id="GraphicsContainer">
        <button
          onClick={() => setAddingPoint(!isAddingPoint)}
        >{isAddingPoint ? 'Cancel' : 'Add Point'}</button>
        <KonvaGraphics
          pulleys={pulleys}
          points={points}
          onPulleySelect={onPulleySelect}
          selectedPulleyId={selectedPulleyId}
          isAddingPoint={isAddingPoint}
          xaddPoint={(x, y) => setPoints(points => [...points, new Point(x, y)])}
          addPoint={addPoint}
        />
      </div>
      <DataTable
        pulleys={pulleys}
        points={points}
        selectedPulleyId={selectedPulleyId}
        onPulleyRadiusChange={(pulleyId, radius) => setPulleys(pulleys => {
          pulleys.find(p => p.id === pulleyId).radius = radius
          return _.cloneDeep(pulleys)
        })}
        onPointXChange={(pointId, x) => setPoints(points => {
          points.find(p => p.id === pointId).x = x
          return _.cloneDeep(points)
        })}
        onPointYChange={(pointId, y) => setPoints(points => {
          points.find(p => p.id === pointId).y = y
          return _.cloneDeep(points)
        })}
        deletePoint={id => setPoints(points => {
          const index = points.findIndex(p => p.id === id)
          points.splice(index, 1)
          return _.cloneDeep(points)
        })}
      />
    </div>
  )
}

class Pulley {
  constructor(x, y, radius = 10) {
    this.id = uuid()
    this.x = x
    this.y = y
    this.radius = radius
  }
}

class Point {
  constructor(x, y) {
    this.id = uuid()
    this.x = x
    this.y = y
  }
}
