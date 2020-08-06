import React from 'react'
import _ from 'lodash'
import update from 'immutability-helper'

import {Navbar} from './Navbar'
import {Sidebar} from './Sidebar'
import {Designer} from './Designer'
import {DataTable} from './DataTable'
import {Footer} from './Footer'
import {uuid} from '../utils/uuid'
import {ROTATION} from '../utils/types'
import {getTangents, getDistanceOfSectionAndPoint} from '../utils/calculator'

let pulleyIdCounter = 0
let beltIdCounter = 0

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
            onPulleyAttributeChange={this.onPulleyAttributeChange}
            onDeletePulley={this.onDeletePulley}
            onRotationChange={this.onRotationChange}
          />

          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            <div className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary mr-2"
                onClick={() => this.onDropPulleyClick('pulley')}
              >{this.state.dropItem === 'pulley' ? 'Cancel' : 'Add Pulley'}</button>
            </div>

            <Designer
              pulleys={this.state.pulleys}
              beltSections={this.state.beltSections}
              dropIndicator={this.state.dropIndicator}
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
    const pulleys = _.range(2).map(n => ({
      id: `p${pulleyIdCounter++}`,
      isSelected: false,
      x: Math.round(Math.random() * 1100 + 50),
      y: Math.round(Math.random() * 500 + 50),
      radius: Math.round(Math.random() * 40 + 10),
      rotation: Math.random() > 0.5 ? ROTATION.CLOCKWISE : ROTATION.ANTICLOCKWISE,
    }))

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
  onDropPulleyClick = type => this.setState({dropItem: this.state.dropItem ? null : type})

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
    const newPulley = {
      id: `p${pulleyIdCounter++}`,
      isSelected: false,
      x: this.state.dropIndicator.x,
      y: this.state.dropIndicator.y,
      radius: 20,
      rotation: ROTATION.CLOCKWISE,
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
      alert(`You can't delete more pulleys`)
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
  //endregion
}
