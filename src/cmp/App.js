import React from 'react'
import _ from 'lodash'
import update from 'immutability-helper'

import {Navbar} from './Navbar'
import {Sidebar} from './Sidebar'
import {Designer} from './Designer'
import {DataTable} from './DataTable'
import {Footer} from './Footer'
import {uuid} from '../utils/uuid'
import {
  PointOnConveyor,
  Pulley,
  DrivePulley,
  // ROTATION,
  PULLEY_TYPE,
} from '../utils/types'
import {getTangents, getDistanceOfSectionAndPoint} from '../utils/calculator'

let pulleyIdCounter = 1
let beltIdCounter = 1

export class App extends React.Component {
  state = {
    pulleys: [],
    beltSections: [],
    dropItem: null,
    dropIndicator: null,
  }

  render() {
    return (
      <React.Fragment>

        <Navbar/>

        <div id="Content" className="container-fluid row">

          <Sidebar
            pulley={this.state.pulleys.find(p => p.isSelected)}
            dropItem={this.state.dropItem}
            onPulleyAttributeChange={this.onPulleyAttributeChange}
            onDeletePulley={this.onDeletePulley}
            onRotationChange={this.onRotationChange}
            onTypeChange={this.onTypeChange}
            onAddPulley={this.onAddPulley}
          />

          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">

            <Designer
              pulleys={this.state.pulleys}
              beltSections={this.state.beltSections}
              dropIndicator={this.state.dropIndicator}
              dropItem={this.state.dropItem}
              onPulleyMove={this.onPulleyMove}
              onPulleySelect={this.onPulleySelect}
              onStageMouseMove={this.onStageMouseMove}
              onStageMouseLeave={this.onStageMouseLeave}
              onStageClick={this.onStageClick}
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

  //region Lifecycle
  componentDidMount() {
    const pulleys = [
      new Pulley(`p${pulleyIdCounter++}`, 200, 300),
      new Pulley(`p${pulleyIdCounter++}`, 1000, 300),
    ]

    /*const pulleys = _.range(6).map(n => new Pulley(
      `p${pulleyIdCounter++}`,
      Math.round(Math.random() * 1100 + 50),
      Math.round(Math.random() * 500 + 50),
      Math.round(Math.random() * 40 + 10),
      Math.random() > 0.5 ? ROTATION.CLOCKWISE : ROTATION.ANTICLOCKWISE
    ))*/

    const beltSections = pulleys.map((pulley, pulleyIndex) => {
      const nextPulley = pulleyIndex === pulleys.length - 1 ? pulleys[0] : pulleys[pulleyIndex + 1]
      const tangents = getTangents(pulley, nextPulley)

      return {
        id: `b${beltIdCounter++}`,
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
  //endregion

  //region Callbacks
  onAddPulley = type => {
    if(this.state.dropItem) {
      this.setState({dropItem: this.state.dropItem === type ? null : type})
    }
    else {
      this.setState({dropItem: type})
    }
  }

  onPulleyMove = ({target}) => {
    const pulleyIndex = this.state.pulleys.findIndex(p => p.id === target.id())
    const pulley = this.state.pulleys[pulleyIndex]
    const nextPulleyIndex = pulleyIndex === this.state.pulleys.length - 1 ? 0 : pulleyIndex + 1
    const prevPulleyIndex = pulleyIndex === 0 ? this.state.pulleys.length - 1 : pulleyIndex - 1

    const nextPulley = this.state.pulleys[nextPulleyIndex]
    const prevPulley = this.state.pulleys[prevPulleyIndex]

    const nextBeltSectionIndex = this.state.beltSections.findIndex(b => b.pulleyId === pulley.id)
    const prevBeltSectionIndex = this.state.beltSections.findIndex(b => b.pulleyId === prevPulley.id)

    const updatedPulley = _.cloneDeep(pulley)
    updatedPulley.x = Math.round(target.x())
    updatedPulley.y = Math.round(target.y())

    const nextTangents = getTangents(updatedPulley, nextPulley)
    const prevTangents = getTangents(prevPulley, updatedPulley)

    this.setState(state => update(state, {
      pulleys: {
        [pulleyIndex]: {
          x: {
            $set: updatedPulley.x,
          },
          y: {
            $set: updatedPulley.y,
          },
        },
      },
      beltSections: {
        [nextBeltSectionIndex]: {
          start: {
            $set: nextTangents.start,
          },
          end: {
            $set: nextTangents.end,
          },
        },
        [prevBeltSectionIndex]: {
          start: {
            $set: prevTangents.start,
          },
          end: {
            $set: prevTangents.end,
          },
        },
      },
    }))
  }

  onPulleyAttributeChange = (key, value) => {
    const pulleyIndex = this.state.pulleys.findIndex(p => p.isSelected)

    const pulley = this.state.pulleys[pulleyIndex]
    const nextPulley = this.state.pulleys[pulleyIndex === this.state.pulleys.length - 1 ? 0 : pulleyIndex + 1]
    const prevPulley = this.state.pulleys[pulleyIndex === 0 ? this.state.pulleys.length - 1 : pulleyIndex - 1]

    const nextBeltSectionIndex = this.state.beltSections.findIndex(b => b.pulleyId === pulley.id)
    const prevBeltSectionIndex = this.state.beltSections.findIndex(b => b.pulleyId === prevPulley.id)

    const updatedPulley = _.cloneDeep(pulley)
    updatedPulley[key] = value

    const nextTangents = getTangents(updatedPulley, nextPulley)
    const prevTangents = getTangents(prevPulley, updatedPulley)

    this.setState(state => update(state, {
      pulleys: {
        [pulleyIndex]: {
          [key]: {
            $set: value,
          },
        },
      },
      beltSections: {
        [nextBeltSectionIndex]: {
          start: {
            $set: nextTangents.start,
          },
          end: {
            $set: nextTangents.end,
          },
        },
        [prevBeltSectionIndex]: {
          start: {
            $set: prevTangents.start,
          },
          end: {
            $set: prevTangents.end,
          },
        },
      },
    }))
  }

  onPulleySelect = ({target}) => {
    const selectedPulleyIndex = this.state.pulleys.findIndex(p => p.isSelected)
    const targetPulleyIndex = this.state.pulleys.findIndex(p => p.id === target.id())

    this.setState(state => update(state, {
      pulleys: {
        [targetPulleyIndex]: {
          isSelected: {
            $set: true,
          },
        },
      },
    }))

    if(selectedPulleyIndex > -1) {
      this.setState(state => update(state, {
        pulleys: {
          [selectedPulleyIndex]: {
            isSelected: {
              $set: false,
            },
          },
        },
      }))
    }
  }

  onStageMouseMove = ({evt}) => {
    if(!this.state.dropItem) {
      return
    }

    let smallestDistance = Number.MAX_SAFE_INTEGER
    let pulleyDropPoint = {x: 0, y: 0}
    let pulleyIdToDropAfter = null

    this.state.pulleys.forEach((pulley, pulleyIndex) => {
      const nextPulley = this.state.pulleys[pulleyIndex === this.state.pulleys.length - 1 ? 0 : pulleyIndex + 1]

      const tangents = getTangents(pulley, nextPulley)
      const distance = getDistanceOfSectionAndPoint([
        {x: tangents.start.x, y: tangents.start.y},
        {x: tangents.end.x, y: tangents.end.y},
      ], {x: evt.layerX, y: evt.layerY})

      if(distance < smallestDistance) {
        smallestDistance = distance
        pulleyIdToDropAfter = pulley.id

        pulleyDropPoint = {
          x: Math.round((tangents.start.x + tangents.end.x) / 2),
          y: Math.round((tangents.start.y + tangents.end.y) / 2),
        }
      }
    })

    this.setState({
      dropIndicator: {
        pulleyId: pulleyIdToDropAfter,
        x: pulleyDropPoint.x,
        y: pulleyDropPoint.y,
      },
    })
  }

  onStageMouseLeave = () => this.setState({dropIndicator: null})

  onStageClick = () => {
    if(!this.state.dropItem) {
      return
    }

    const prevPulleyIndex = this.state.pulleys.findIndex(p => p.id === this.state.dropIndicator.pulleyId)
    const prevPulley = this.state.pulleys[prevPulleyIndex]
    const nextPulley = this.state.pulleys[prevPulleyIndex === this.state.pulleys.length - 1 ? 0 : prevPulleyIndex + 1]
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

    const prevTangents = getTangents(prevPulley, newPulley)
    const nextTangents = getTangents(newPulley, nextPulley)

    const prevBeltSection = {
      id: `b${beltIdCounter++}`,
      pulleyId: prevPulley.id,
      nextPulleyId: newPulley.id,
      start: prevTangents.start,
      end: prevTangents.end,
    }
    const nextBeltSection = {
      id: `b${beltIdCounter++}`,
      pulleyId: newPulley.id,
      nextPulleyId: nextPulley.id,
      start: nextTangents.start,
      end: nextTangents.end,
    }

    const oldBeltSectionIndex = this.state.beltSections.findIndex(b => b.pulleyId === prevPulley.id)

    this.setState(state => update(state, {
      pulleys: {
        $splice: [[prevPulleyIndex + 1, 0, newPulley]],
      },
      beltSections: {
        $splice: [[oldBeltSectionIndex, 1, prevBeltSection, nextBeltSection]],
      },
    }))
  }

  onDeletePulley = () => {
    if(this.state.pulleys.length <= 2) {
      alert(`Can't delete. Minimum object count is 2.`)
      return
    }

    const pulleyIndex = this.state.pulleys.findIndex(p => p.isSelected)
    const nextPulleyIndex = pulleyIndex === this.state.pulleys.length - 1 ? 0 : pulleyIndex + 1
    const prevPulleyIndex = pulleyIndex === 0 ? this.state.pulleys.length - 1 : pulleyIndex - 1

    const pulley = this.state.pulleys[pulleyIndex]
    const nextPulley = this.state.pulleys[nextPulleyIndex]
    const prevPulley = this.state.pulleys[prevPulleyIndex]

    const prevBeltSectionIndex = this.state.beltSections.findIndex(b => b.pulleyId === prevPulley.id)

    const tangents = getTangents(prevPulley, nextPulley)
    const beltSectionsWithoutOlds = this.state.beltSections.filter(b => b.pulleyId !== pulley.id && b.pulleyId !== prevPulley.id)

    beltSectionsWithoutOlds.splice(prevBeltSectionIndex === 0 ? beltSectionsWithoutOlds.length - 1 : prevBeltSectionIndex - 1, 0, {
      id: uuid(),
      pulleyId: prevPulley.id,
      nextPulleyId: nextPulley.id,
      start: tangents.start,
      end: tangents.end,
    })

    this.setState(state => update(state, {
      pulleys: {
        $splice: [[pulleyIndex, 1]],
      },
      beltSections: {
        $set: beltSectionsWithoutOlds,
      },
    }))
  }

  onRotationChange = rotation => {
    const pulleyIndex = this.state.pulleys.findIndex(p => p.isSelected)
    const nextPulleyIndex = pulleyIndex === this.state.pulleys.length - 1 ? 0 : pulleyIndex + 1
    const prevPulleyIndex = pulleyIndex === 0 ? this.state.pulleys.length - 1 : pulleyIndex - 1

    const pulley = this.state.pulleys[pulleyIndex]
    const nextPulley = this.state.pulleys[nextPulleyIndex]
    const prevPulley = this.state.pulleys[prevPulleyIndex]

    const nextBeltSectionIndex = this.state.beltSections.findIndex(b => b.pulleyId === pulley.id)
    const prevBeltSectionIndex = this.state.beltSections.findIndex(b => b.pulleyId === prevPulley.id)

    const updatedPulley = _.cloneDeep(pulley)
    updatedPulley.rotation = rotation

    const nextTangents = getTangents(updatedPulley, nextPulley)
    const prevTangents = getTangents(prevPulley, updatedPulley)

    this.setState(state => update(state, {
      pulleys: {
        [pulleyIndex]: {
          rotation: {
            $set: rotation,
          },
        },
      },
      beltSections: {
        [nextBeltSectionIndex]: {
          start: {
            $set: nextTangents.start,
          },
          end: {
            $set: nextTangents.end,
          },
        },
        [prevBeltSectionIndex]: {
          start: {
            $set: prevTangents.start,
          },
          end: {
            $set: prevTangents.end,
          },
        },
      },
    }))
  }

  onTypeChange = type => {
    const pulleyIndex = this.state.pulleys.findIndex(p => p.isSelected)
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

    newPulley.isSelected = true

    const nextPulley = this.state.pulleys[pulleyIndex === this.state.pulleys.length - 1 ? 0 : pulleyIndex + 1]
    const prevPulley = this.state.pulleys[pulleyIndex === 0 ? this.state.pulleys.length - 1 : pulleyIndex - 1]

    const nextBeltSectionIndex = this.state.beltSections.findIndex(b => b.pulleyId === newPulley.id)
    const prevBeltSectionIndex = this.state.beltSections.findIndex(b => b.pulleyId === prevPulley.id)

    const nextTangents = getTangents(newPulley, nextPulley)
    const prevTangents = getTangents(prevPulley, newPulley)

    this.setState(state => update(state, {
      pulleys: {
        [pulleyIndex]: {
          $set: newPulley,
        },
      },
      beltSections: {
        [nextBeltSectionIndex]: {
          start: {
            $set: nextTangents.start,
          },
          end: {
            $set: nextTangents.end,
          },
        },
        [prevBeltSectionIndex]: {
          start: {
            $set: prevTangents.start,
          },
          end: {
            $set: prevTangents.end,
          },
        },
      },
    }))
  }
  //endregion
}
