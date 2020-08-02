import React from 'react'
import update from 'immutability-helper'
import _ from 'lodash'

import {Designer} from './Designer'
import {Navbar} from './Navbar'
import {Sidebar} from './Sidebar'
import {DataTable} from './DataTable'
import {Footer} from './Footer'
import {uuid} from '../utils/uuid'
import {ROTATION} from '../utils/types'

export const App = () => {
  const [pulleys, setPulleys] = React.useState(_.range(3).map(n => ({
    id: uuid(),
    x: Math.round(Math.random() * 1100 + 50),
    y: Math.round(Math.random() * 500 + 50),
    radius: Math.round(Math.random() * 40 + 10),
    rotation: Math.random() > 0.5 ? ROTATION.CLOCKWISE : ROTATION.ANTICLOCKWISE,
  })))
  const [dropItem, setDropItem] = React.useState(null)
  const [selectedPulleyId, setSelectedPulleyId] = React.useState(null)
  const selectedPulley = pulleys.find(p => p.id === selectedPulleyId)

  const onDropPulleyClick = () => {
    setDropItem(dropItem => {
      if(dropItem === 'Pulley') {
        return null
      }
      else {
        return 'Pulley'
      }
    })
  }

  const onDeselectClick = () => {
    const stage = window.Konva.stages[0]
    stage.findOne(`#${selectedPulleyId}`).setAttr('fill', '#eee')
    setSelectedPulleyId(null)
    stage.children[0].draw()
  }

/*
  const onPulleyDrop = (location, partIndex) => {
    setConveyor(conveyor => {
      const previousPart = partIndex === 0 ? conveyor.parts[conveyor.parts.length - 1] : conveyor.parts[partIndex - 1]
      const nextPart = partIndex === conveyor.parts.length - 1 ? conveyor.parts[0] : conveyor.parts[partIndex + 1]
      const newPulley = new Pulley(new Point(location.x, location.y))
      const firstNewBeltSection = new FreeBeltSection(previousPart, newPulley)
      const secondNewBeltSection = new FreeBeltSection(newPulley, nextPart)
      conveyor.parts.splice(partIndex, 1, firstNewBeltSection, newPulley, secondNewBeltSection)
      return _.cloneDeep(conveyor)
    })
  }
*/

  /*const xonPulleyDrop = (dropPoint, pulleyIndex) => {
    setPulleys(pulleys => update(pulleys, {
      $splice: [[pulleyIndex + 1, 0, {
        x: dropPoint.x,
        y: dropPoint.y,
        radius: 20,
        rotation: ROTATION.CLOCKWISE,
      }]]
    }))
  }*/

  const onPulleyMove = (id, x, y) => {
    const pulleyIndex = pulleys.findIndex(p => p.id === id)

    setPulleys(pulleys => update(pulleys, {
      [pulleyIndex]: {
        x: {
          $set: x,
        },
        y: {
          $set: y,
        },
      },
    }))
  }

  return (
    <React.Fragment>

      <Navbar/>

      <div id="Content" className="container-fluid row">

        <Sidebar
          pulleys={pulleys}
          selectedPulley={selectedPulley}
          setPulleys={setPulleys}
        />

        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
          <div className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary mr-2"
              onClick={onDropPulleyClick}
            >{dropItem === 'Pulley' ? 'Cancel' : 'Add Pulley'}</button>
            {selectedPulley && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={onDeselectClick}
              >Deselect</button>
            )}
          </div>

          <Designer
            selectedPulleyId={selectedPulleyId}
            setSelectedPulleyId={setSelectedPulleyId}
            pulleys={pulleys}
            dropItem={!!dropItem}
            // onPulleyDrop={onPulleyDrop}
            // xonPulleyDrop={xonPulleyDrop}
            onPulleyMove={onPulleyMove}
          />

          <DataTable
            pulleys={pulleys}
            selectedPulleyId={selectedPulleyId}
          />

        </main>
      </div>

      <Footer/>

    </React.Fragment>
  )
}
