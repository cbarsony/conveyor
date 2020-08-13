import React from 'react'
import update from 'immutability-helper'
import _ from 'lodash'
import Flatten from '@flatten-js/core'

import {Navbar} from './Navbar'
import {Sidebar} from './Sidebar'
import {Designer} from './Designer'
import {DataTable} from './DataTable'
import {
  PointOnConveyor,
  Pulley,
  DrivePulley,
  // ROTATION,
  PULLEY_TYPE,
} from '../utils/types'
import {getTangents, getDistanceOfSectionAndPoint, getDistanceOfTwoPoints} from '../utils/calculator'

const getBeltSections = pulleys => pulleys.map((pulley, pulleyIndex) => {
  const nextPulley = pulleyIndex === pulleys.length - 1 ? pulleys[0] : pulleys[pulleyIndex + 1]
  const tangents = getTangents(pulley, nextPulley)

  return {
    pulleyId: pulley.id,
    start: {
      x: tangents.start.x,
      y: tangents.start.y,
    },
    end: {
      x: tangents.end.x,
      y: tangents.end.y,
    },
  }
})

let pulleyIdCounter = 1
let beltSections = []

export class App extends React.Component {
  state = {
    pulleys: [],
    dropItem: null,
    dropIndicator: null,
    selectedPulleyId: null,
    isGridVisible: true,
    cursor: {
      x: 0,
      y: 0,
    },
  }

  render() {
    return (
      <React.Fragment>

        <Navbar
          isGridVisible={this.state.isGridVisible}
          onChangeGridVisible={isGridVisible => this.setState({isGridVisible})}
        />

        <div id="Content" className="container-fluid row">

          <Sidebar
            pulley={this.state.pulleys.find(p => p.id === this.state.selectedPulleyId)}
            dropItem={this.state.dropItem}
            cursor={this.state.cursor}
            onPulleyAttributeChange={this.onPulleyAttributeChange}
            onDeletePulley={this.onDeletePulley}
            onRotationChange={this.onRotationChange}
            onTypeChange={this.onTypeChange}
            onAddPulley={this.onAddPulley}
          />

          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">

            <Designer
              pulleys={this.state.pulleys}
              selectedPulleyId={this.state.selectedPulleyId}
              beltSections={beltSections}
              dropIndicator={this.state.dropIndicator}
              dropItem={this.state.dropItem}
              isGridVisible={this.state.isGridVisible}

              onPulleyMove={this.onPulleyMove}
              onPulleySelect={this.onPulleySelect}

              onStageMouseMove={this.onStageMouseMove}
              onStageMouseLeave={this.onStageMouseLeave}
              onStageClick={this.onStageClick}
            />

            <DataTable
              pulleys={this.state.pulleys}
              selectedPulleyId={this.state.selectedPulleyId}
              beltSections={beltSections}
              onPulleyAttributeChange={this.onPulleyAttributeChange}
              onRotationChange={this.onRotationChange}
              onTypeChange={this.onTypeChange}
            />

          </main>

        </div>

        <footer>&copy; 2020 CONVtek. All Rights Reserved.</footer>

      </React.Fragment>
    )
  }

  //region Lifecycle

  componentDidMount() {
    this.stage = window.Konva.stages[0]

    const pulleys = [
      new Pulley(`p${pulleyIdCounter++}`, 200, 300),
      new Pulley(`p${pulleyIdCounter++}`, 1000, 300),
    ]

    /*const pulleys = _.range(7).map(n => new Pulley(
     `p${pulleyIdCounter++}`,
     Math.round(Math.random() * 1100 + 50),
     Math.round(Math.random() * 500 + 50),
     Math.round(Math.random() * 40 + 10),
     Math.random() > 0.5 ? ROTATION.CLOCKWISE : ROTATION.ANTICLOCKWISE
     ))*/

    this.setState({pulleys})
  }

  shouldComponentUpdate(nextProps, nextState) {
    //Optimization: call getBeltSections only if pulleys change
    if(!_.isEqual(this.state.pulleys, nextState.pulleys)) {
      beltSections = getBeltSections(nextState.pulleys)
    }

    return true
  }

  //endregion Lifecycle

  //region Callbacks

  //TODO: give better name
  onAddPulley = type => {
    if(this.state.dropItem) {
      this.setState({dropItem: this.state.dropItem === type ? null : type})
    }
    else {
      this.setState({dropItem: type})
    }
  }

  onPulleyMove = (id, x, y) => {
    const pulleyIndex = this.state.pulleys.findIndex(p => p.id === id)

    this.setState(state => update(state, {
      pulleys: {
        [pulleyIndex]: {
          x: {
            $set: x,
          },
          y: {
            $set: y,
          },
        },
      },
    }))
  }

  onPulleyAttributeChange = (key, value, pulleyId) => {
    const id = pulleyId || this.state.selectedPulleyId
    const pulleyIndex = this.state.pulleys.findIndex(p => p.id === id)

    this.setState(state => update(state, {
      pulleys: {
        [pulleyIndex]: {
          [key]: {
            $set: value,
          },
        },
      },
    }))
  }

  onPulleySelect = id => this.setState({selectedPulleyId: id === this.state.selectedPulleyId ? null : id})

  onDeletePulley = () => {
    if(this.state.pulleys.length <= 2) {
      alert(`Can't delete. Minimum object count is 2.`)
      return
    }

    const pulleyIndex = this.state.pulleys.findIndex(p => p.id === this.state.selectedPulleyId)

    this.setState(state => update(state, {
      pulleys: {
        $splice: [[pulleyIndex, 1]],
      },
    }))
  }

  onRotationChange = (rotation, pulleyId) => {
    const id = pulleyId || this.state.selectedPulleyId
    const pulleyIndex = this.state.pulleys.findIndex(p => p.id === id)

    this.setState(state => update(state, {
      pulleys: {
        [pulleyIndex]: {
          rotation: {
            $set: rotation,
          },
        },
      },
    }))
  }

  onTypeChange = (type, pulleyId) => {
    const id = pulleyId || this.state.selectedPulleyId
    const pulleyIndex = this.state.pulleys.findIndex(p => p.id === id)

    const pulley = this.state.pulleys[pulleyIndex]
    let newPulley

    switch(type) {
      case PULLEY_TYPE.POINT_ON_CONVEYOR:
        newPulley = new PointOnConveyor(pulley.id, pulley.x, pulley.y)
        break

      case PULLEY_TYPE.PULLEY:
        const pulleyRadius = pulley.type === PULLEY_TYPE.POINT_ON_CONVEYOR ? 20 : pulley.radius
        newPulley = new Pulley(pulley.id, pulley.x, pulley.y, pulleyRadius, pulley.rotation)
        break

      case PULLEY_TYPE.DRIVE_PULLEY:
        const drivePulleyRadius = pulley.type === PULLEY_TYPE.POINT_ON_CONVEYOR ? 20 : pulley.radius
        newPulley = new DrivePulley(pulley.id, pulley.x, pulley.y, drivePulleyRadius, pulley.rotation)
        break

      default:
        throw new Error(`Unknown pulley type ${type}`)
    }

    this.setState(state => update(state, {
      pulleys: {
        [pulleyIndex]: {
          $set: newPulley,
        },
      },
    }))
  }

  onStageMouseMove = (x, y) => {
    const stageX = (x - this.stage.x()) / this.stage.scaleX()
    const stageY = (y - this.stage.y()) / this.stage.scaleY()

    if(!this.state.dropItem) {
      this.setState({
        cursor: {
          x: Math.round(stageX),
          y: Math.round(stageY),
        },
      })
    }
    else {
      let smallestDistance = Number.MAX_SAFE_INTEGER
      let pulleyToDrop = null
      let nextPulleyToDrop = null

      this.state.pulleys.forEach((pulley, pulleyIndex) => {
        const nextPulley = this.state.pulleys[pulleyIndex === this.state.pulleys.length - 1 ? 0 : pulleyIndex + 1]

        const tempTangents = getTangents(pulley, nextPulley)
        const distance = getDistanceOfSectionAndPoint([
          {x: tempTangents.start.x, y: tempTangents.start.y},
          {x: tempTangents.end.x, y: tempTangents.end.y},
        ], {
          x: stageX,
          y: stageY,
        })

        if(distance < smallestDistance) {
          smallestDistance = distance
          pulleyToDrop = pulley
          nextPulleyToDrop = nextPulley
        }
      })

      const tangents = getTangents(pulleyToDrop, nextPulleyToDrop)

      const cursor = new Flatten.Point(stageX, stageY)
      const segment = new Flatten.Segment(
        new Flatten.Point(tangents.start.x, tangents.start.y),
        new Flatten.Point(tangents.end.x, tangents.end.y),
      )
      const distance = cursor.distanceTo(segment)

      this.setState({
        dropIndicator: {
          pulleyId: pulleyToDrop.id,
          x: distance[1].pe.x,
          y: distance[1].pe.y,
        },
        cursor: {
          x: stageX,
          y: stageY,
        }
      })
    }
  }

  onStageMouseLeave = () => this.setState({dropIndicator: null})

  onStageClick = () => {
    if(!this.state.dropItem) {
      return
    }

    const prevPulleyIndex = this.state.pulleys.findIndex(p => p.id === this.state.dropIndicator.pulleyId)
    let newPulley

    switch(this.state.dropItem) {
      case PULLEY_TYPE.POINT_ON_CONVEYOR:
        newPulley = new PointOnConveyor(`p${pulleyIdCounter++}`, this.state.dropIndicator.x, this.state.dropIndicator.y)
        break

      case PULLEY_TYPE.PULLEY:
        newPulley = new Pulley(`p${pulleyIdCounter++}`, this.state.dropIndicator.x, this.state.dropIndicator.y)
        break

      case PULLEY_TYPE.DRIVE_PULLEY:
        newPulley = new DrivePulley(`p${pulleyIdCounter++}`, this.state.dropIndicator.x, this.state.dropIndicator.y)
        break

      default:
        throw new Error(`Unknown pulley type ${this.state.dropItem}`)
    }

    this.setState(state => update(state, {
      pulleys: {
        $splice: [[prevPulleyIndex + 1, 0, newPulley]],
      },
    }))
  }

  //endregion Callbacks
}
