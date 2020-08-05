import React from 'react'
import _ from 'lodash'

import {Navbar} from './Navbar'
import {Sidebar} from './Sidebar'
import {Designer} from './Designer'
import {DataTable} from './DataTable'
import {Footer} from './Footer'
import {uuid} from '../utils/uuid'
import {ROTATION} from '../utils/types'
import {getTangents} from '../utils/calculator'

export class App extends React.Component {
  state = {
    pulleys: [],
    beltSections: [],
    selectedPulleyId: null,
  }

  componentDidMount() {
    const pulleys = _.range(2).map(n => ({
      id: uuid(),
      x: Math.round(Math.random() * 1100 + 50),
      y: Math.round(Math.random() * 500 + 50),
      radius: Math.round(Math.random() * 40 + 10),
      rotation: Math.random() > 0.5 ? ROTATION.CLOCKWISE : ROTATION.ANTICLOCKWISE,
    }))

    const beltSections = pulleys.map((pulley, pulleyIndex) => {
      const nextPulley = pulleyIndex === pulleys.length - 1 ? pulleys[0] : pulleys[pulleyIndex + 1]
      const tangents = getTangents(pulley, nextPulley)
      console.log(tangents)

      return {
        id: uuid(),
        pulleyId: pulley.id,
        nextPulleyId: nextPulley.id,
        start: tangents.start,
        end: tangents.end,
      }
    })

    this.setState({
      pulleys,
      beltSections,
    })
  }

  render() {
    const selectedPulley = this.state.pulleys[this.state.selectedPulleyId]

    return (
      <React.Fragment>

        <Navbar/>

        <div id="Content" className="container-fluid row">

          <Sidebar
            pulley={selectedPulley}
            onPulleyAttributeChange={this.onPulleyAttributeChange}
            onDeletePulley={this.onDeletePulley}
            onRotationChange={this.onRotationChange}
          />

          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            <div className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary mr-2"
                onClick={this.onDropPulleyClick}
              >{this.state.dropItem === 'Pulley' ? 'Cancel' : 'Add Pulley'}</button>
              {selectedPulley && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={this.onDeselectClick}
                >Deselect</button>
              )}
            </div>

            <Designer
              pulleys={this.state.pulleys}
              beltSections={this.state.beltSections}
            />

            <DataTable
              pulleys={this.state.pulleys}
              selectedPulleyId={this.state.selectedPulleyId}
            />

          </main>
        </div>

        <Footer/>

      </React.Fragment>
    )
  }

  //region Callbacks
  onDropPulleyClick = () => {}

  onDeselectClick = () => {}

  onPulleyDrop = () => {}

  onPulleyMove = () => {}

  onPulleyAttributeChange = () => {}

  onSelectedPulleyIdChange = () => {}

  onStageMouseMove = () => {}

  onStageMouseLeave = () => {}

  onStageMouseClick = () => {}

  onPulleyClick = () => {}

  onPulleyPositionChange = () => {}

  onDeletePulley = () => {}

  onRotationChange = () => {}
  //endregion
}
