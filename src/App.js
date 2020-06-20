import React from 'react'

import {Graphics} from './Graphics'
import {DataTable} from './DataTable'

export const App = () => {
  const [pulleys, setPulleys] = React.useState([])

  return (
    <div id="App">
      <button
        onClick={() => setPulleys(pulleys => [...pulleys, new Pulley(
          Math.random() * 700 + 50,
          Math.random() * 500 + 50,
          Math.ceil(Math.random() * 25 + 25),
        )])}
      >
        Add pulley
      </button>
      <Graphics
        pulleys={pulleys}
      />
      <DataTable
        pulleys={pulleys}
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
