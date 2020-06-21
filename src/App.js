import React from 'react'
import _ from 'lodash'

import {KonvaGraphics} from './KonvaGraphics'
import {DataTable} from './DataTable'

export const App = () => {
  const [pulleys, setPulleys] = React.useState([])
  const [selectedPulleyId, setSelectedPulleyId] = React.useState()
  const onPulleySelect = id => setSelectedPulleyId(id)

  return (
    <div id="App">
      <div id="GraphicsContainer">
        <button
          id="AddPulleyButton"
          onClick={() => setPulleys(pulleys => [...pulleys, new Pulley(
            Math.ceil(Math.random() * 700 + 50),
            Math.ceil(Math.random() * 500 + 50),
            Math.ceil(Math.random() * 40 + 10)
          )])}
        >
          Add pulley
        </button>
        <KonvaGraphics
          pulleys={pulleys}
          onPulleySelect={onPulleySelect}
          selectedPulleyId={selectedPulleyId}
        />
      </div>
      <DataTable
        pulleys={pulleys}
        selectedPulleyId={selectedPulleyId}
        onPulleyRadiusChange={(pulleyId, radius) => setPulleys(pulleys => {
          pulleys.find(p => p.id === pulleyId).radius = radius
          return _.cloneDeep(pulleys)
        })}
        onPulleyXChange={(pulleyId, x) => setPulleys(pulleys => {
          pulleys.find(p => p.id === pulleyId).x = x
          return _.cloneDeep(pulleys)
        })}
        onPulleyYChange={(pulleyId, y) => setPulleys(pulleys => {
          pulleys.find(p => p.id === pulleyId).y = y
          return _.cloneDeep(pulleys)
        })}
      />
    </div>
  )
}

class Pulley {
  constructor(x, y, radius = 10) {
    this.id = Pulley.incrementId()
    this.x = x
    this.y = y
    this.radius = radius
  }

  static incrementId() {
    if (!this.latestId) this.latestId = 1
    else this.latestId++
    return this.latestId
  }
}
