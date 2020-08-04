import React from 'react'
import update from 'immutability-helper'
import _ from 'lodash'
import Konva from 'konva'

import {designer} from '../designer'
import {Navbar} from './Navbar'
import {Sidebar} from './Sidebar'
import {DataTable} from './DataTable'
import {Footer} from './Footer'
import {uuid} from '../utils/uuid'
import {ROTATION} from '../utils/types'
import {getTangents, getDistanceOfSectionAndPoint} from '../utils/calculator'

let stage, layer

export class App extends React.Component {
  state = {
    pulleys: _.range(2).map(n => ({
      id: uuid(),
      x: Math.round(Math.random() * 1100 + 50),
      y: Math.round(Math.random() * 500 + 50),
      radius: Math.round(Math.random() * 40 + 10),
      rotation: Math.random() > 0.5 ? ROTATION.CLOCKWISE : ROTATION.ANTICLOCKWISE,
    })),
    dropItem: null,
    selectedPulleyId: null,
    pulleyDropPoint: {x: 0, y: 0},
    pulleyIdToDropAfter: null,
  }

  /*CALLBACKS*/

  onDropPulleyClick = () => this.setState({dropItem: this.state.dropItem === 'Pulley' ? null : 'Pulley'})

  onDeselectClick = () => {
    const stage = window.Konva.stages[0]
    stage.findOne(`#${this.state.selectedPulleyId}`).setAttr('fill', '#eee')
    this.setState({selectedPulleyId: null})
    layer.draw()
  }

  onPulleyDrop = (id, dropPoint) => {
    const pulleyIndex = this.state.pulleys.findIndex(p => p.id === id)

    this.setState(state => update(state, {
      pulleys: {
        $splice: [[pulleyIndex + 1, 0, {
          id,
          x: dropPoint.x,
          y: dropPoint.y,
          radius: 20,
          rotation: ROTATION.CLOCKWISE,
        }]],
      },
    }))
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

  onPulleyAttributeChange = (name, value) => {
    const pulleyIndex = this.state.pulleys.findIndex(p => p.id === this.state.selectedPulleyId)

    this.setState(state => update(state, {
      pulleys: {
        [pulleyIndex]: {
          [name]: {
            $set: value,
          },
        },
      },
    }))
  }

  onSelectedPulleyIdChange = id => this.setState({selectedPulleyId: id})

  onStageMouseMove = ({evt}) => {
    if(this.state.dropItem) {
      const dropIndicator = stage.findOne('#dropIndicator')
      const pulleys = this.state.pulleys

      let smallestDistance = Number.MAX_SAFE_INTEGER
      let pulleyDropPoint = {x: 0, y: 0}
      let pulleyIdToDropAfter = null

      pulleys.forEach((pulley, pulleyIndex) => {
        // const nextPulley = pulleyIndex === pulleys.length - 1 ? pulleys[0] : pulleys[pulleyIndex + 1]
        const pulleyGeometry = stage.findOne(`#${pulley.id}`)
        const nextPulleyGeometry = stage.findOne(`#${pulleyGeometry.attrs.data.nextPulleyId}`)

        const tangents = getTangents({
          x: pulleyGeometry.getPosition().x,
          y: pulleyGeometry.getPosition().y,
          radius: pulleyGeometry.getRadius(),
          rotation: pulleyGeometry.attrs.data.rotation,
        }, {
          x: nextPulleyGeometry.getPosition().x,
          y: nextPulleyGeometry.getPosition().y,
          radius: nextPulleyGeometry.getRadius(),
          rotation: nextPulleyGeometry.attrs.data.rotation,
        })
        const distance = getDistanceOfSectionAndPoint([
          {x: tangents.start.x, y: tangents.start.y},
          {x: tangents.end.x, y: tangents.end.y},
        ], {x: evt.layerX, y: evt.layerY})

        if(distance < smallestDistance) {
          smallestDistance = distance
          pulleyIdToDropAfter = pulley.id

          pulleyDropPoint = {
            x: (tangents.start.x + tangents.end.x) / 2,
            y: (tangents.start.y + tangents.end.y) / 2,
          }
        }
      })

      dropIndicator.setAttr('opacity', 1)
      dropIndicator.setAttr('x', pulleyDropPoint.x)
      dropIndicator.setAttr('y', pulleyDropPoint.y)

      layer.draw()

      this.setState({
        pulleyDropPoint,
        pulleyIdToDropAfter,
      })
    }
  }

  onStageMouseLeave = () => {
    if(this.state.dropItem) {
      const dropIndicator = stage.findOne('#dropIndicator')
      dropIndicator.setAttr('opacity', 0)
      layer.draw()
    }
  }

  onStageMouseClick = () => {
    if(this.state.dropItem) {
      const id = this.state.pulleyIdToDropAfter
      const dropPoint = this.state.pulleyDropPoint

      const stage = window.Konva.stages[0]
      const oldBelt = stage.findOne(`#belt_${id}`)
      const prevPulley = stage.findOne(`#${id}`)
      const nextPulley = stage.findOne(`#${prevPulley.attrs.data.nextPulleyId}`)
      const newPulleyId = uuid()
      const newPulley = new Konva.Circle({
        data: {
          nextPulleyId: nextPulley.attrs.id,
          prevPulleyId: prevPulley.attrs.id,
          rotation: ROTATION.CLOCKWISE,
        },
        id: newPulleyId,
        x: dropPoint.x,
        y: dropPoint.y,
        radius: 20,
        fill: '#eee',
        stroke: '#888',
        shadowForStrokeEnabled: false,
        draggable: true,
      }).on('click', this.onPulleyClick)
        .on('dragend', this.onPulleyPositionChange)

      prevPulley.attrs.data.nextPulleyId = newPulleyId
      nextPulley.attrs.data.prevPulleyId = newPulleyId

      const prevPulleyPosition = prevPulley.getPosition()
      const newPulleyPosition = newPulley.getPosition()
      const nextPulleyPosition = nextPulley.getPosition()

      const prevLineTangents = getTangents({
        x: prevPulleyPosition.x,
        y: prevPulleyPosition.y,
        radius: prevPulley.getRadius(),
        rotation: prevPulley.attrs.data.rotation,
      }, {
        x: newPulleyPosition.x,
        y: newPulleyPosition.y,
        radius: newPulley.getRadius(),
        rotation: newPulley.attrs.data.rotation,
      })

      const nextLineTangents = getTangents({
        x: newPulleyPosition.x,
        y: newPulleyPosition.y,
        radius: newPulley.getRadius(),
        rotation: newPulley.attrs.data.rotation,
      }, {
        x: nextPulleyPosition.x,
        y: nextPulleyPosition.y,
        radius: nextPulley.getRadius(),
        rotation: nextPulley.attrs.data.rotation,
      })

      const prevLine = new Konva.Line({
        id: `belt_${prevPulley.attrs.id}`,
        points: [
          prevLineTangents.start.x,
          prevLineTangents.start.y,
          prevLineTangents.end.x,
          prevLineTangents.end.y,
        ],
        stroke: '#888',
        shadowForStrokeEnabled: false,
      })

      const nextLine = new Konva.Line({
        id: `belt_${newPulley.attrs.id}`,
        points: [
          nextLineTangents.start.x,
          nextLineTangents.start.y,
          nextLineTangents.end.x,
          nextLineTangents.end.y,
        ],
        stroke: '#888',
        shadowForStrokeEnabled: false,
      })

      oldBelt.destroy()

      layer.add(newPulley)
      layer.add(prevLine)
      layer.add(nextLine)
      layer.draw()

      this.onPulleyDrop(newPulleyId, this.state.pulleyDropPoint)

      this.setState({
        pulleyDropPoint: {x: 0, y: 0},
        pulleyIdToDropAfter: null,
      })
    }
  }

  onPulleyClick = ({target}) => {
    if(this.state.dropItem) {
      return
    }

    stage.find('Circle').forEach(circle => {
      if(circle.attrs.id !== target.attrs.id) {
        circle.setAttr('fill', '#eee')
      }
    })

    const selectedPulley = stage.findOne(`#${target.attrs.id}`)
    selectedPulley.setAttr('fill', '#ff9089')

    layer.draw()
    this.onSelectedPulleyIdChange(target.attrs.id)
  }

  onPulleyPositionChange = ({target}) => {
    const id = target.attrs.id
    const pulley = stage.findOne(`#${id}`)
    const pulleyPosition = pulley.getPosition()

    designer.drawBeltsAfterPulleyPositionChange(id)

    this.onPulleyMove(target.attrs.id, Math.round(pulleyPosition.x), Math.round(pulleyPosition.y))
  }

  onDeletePulley = () => {
    const pulley = stage.findOne(`#${this.state.selectedPulleyId}`)
    const pulleyIndex = this.state.pulleys.findIndex(p => p.id === this.state.selectedPulleyId)
    const prevPulley = stage.findOne(`#${pulley.attrs.data.prevPulleyId}`)
    const nextPulley = stage.findOne(`#${pulley.attrs.data.nextPulleyId}`)

    const prevPulleyPosition = prevPulley.getPosition()
    const nextPulleyPosition = nextPulley.getPosition()

    const newTangents = getTangents({
      x: prevPulleyPosition.x,
      y: prevPulleyPosition.y,
      radius: prevPulley.getRadius(),
      rotation: prevPulley.attrs.data.rotation,
    }, {
      x: nextPulleyPosition.x,
      y: nextPulleyPosition.y,
      radius: nextPulley.getRadius(),
      rotation: nextPulley.attrs.data.rotation,
    })

    const oldNextLine = stage.findOne(`#belt_${pulley.attrs.id}`)
    const oldPrevLine = stage.findOne(`#belt_${prevPulley.attrs.id}`)

    oldNextLine.destroy()
    oldPrevLine.destroy()
    pulley.destroy()

    const newLine = new Konva.Line({
      id: `belt_${prevPulley.attrs.id}`,
      points: [
        newTangents.start.x,
        newTangents.start.y,
        newTangents.end.x,
        newTangents.end.y,
      ],
      stroke: '#888',
      shadowForStrokeEnabled: false,
    })

    prevPulley.attrs.data.nextPulleyId = nextPulley.attrs.id
    nextPulley.attrs.data.prevPulleyId = prevPulley.attrs.id

    layer.add(newLine)
    layer.draw()

    this.setState(state => update(state, {
      pulleys: {
        $splice: [[pulleyIndex, 1]],
      },
    }))
  }

  onRotationChange = rotation => {
    const pulley = stage.findOne(`#${this.state.selectedPulleyId}`)
    const prevPulley = stage.findOne(`#${pulley.attrs.data.prevPulleyId}`)
    const nextPulley = stage.findOne(`#${pulley.attrs.data.nextPulleyId}`)

    const prevPulleyPosition = prevPulley.getPosition()
    const pulleyPosition = pulley.getPosition()
    const nextPulleyPosition = nextPulley.getPosition()

    pulley.attrs.data.rotation = rotation

    const oldNextLine = stage.findOne(`#belt_${pulley.attrs.id}`)
    const oldPrevLine = stage.findOne(`#belt_${prevPulley.attrs.id}`)

    oldNextLine.destroy()
    oldPrevLine.destroy()

    const prevLineTangents = getTangents({
      x: prevPulleyPosition.x,
      y: prevPulleyPosition.y,
      radius: prevPulley.getRadius(),
      rotation: prevPulley.attrs.data.rotation,
    }, {
      x: pulleyPosition.x,
      y: pulleyPosition.y,
      radius: pulley.getRadius(),
      rotation: pulley.attrs.data.rotation,
    })

    const nextLineTangents = getTangents({
      x: pulleyPosition.x,
      y: pulleyPosition.y,
      radius: pulley.getRadius(),
      rotation: pulley.attrs.data.rotation,
    }, {
      x: nextPulleyPosition.x,
      y: nextPulleyPosition.y,
      radius: nextPulley.getRadius(),
      rotation: nextPulley.attrs.data.rotation,
    })

    const prevLine = new Konva.Line({
      id: `belt_${prevPulley.attrs.id}`,
      points: [
        prevLineTangents.start.x,
        prevLineTangents.start.y,
        prevLineTangents.end.x,
        prevLineTangents.end.y,
      ],
      stroke: '#888',
      shadowForStrokeEnabled: false,
    })

    const nextLine = new Konva.Line({
      id: `belt_${pulley.attrs.id}`,
      points: [
        nextLineTangents.start.x,
        nextLineTangents.start.y,
        nextLineTangents.end.x,
        nextLineTangents.end.y,
      ],
      stroke: '#888',
      shadowForStrokeEnabled: false,
    })

    layer.add(prevLine)
    layer.add(nextLine)
    layer.draw()

    const pulleyIndex = this.state.pulleys.findIndex(p => p.id === this.state.selectedPulleyId)

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

  /*CALLBACKS END*/

  componentDidMount() {
    const {pulleys} = this.state

    stage = new Konva.Stage({
      container: 'Designer',
      width: 1200,
      height: 600,
    })
    layer = new Konva.Layer()

    stage
      .on('mouseleave', this.onStageMouseLeave)
      .on('mousemove', this.onStageMouseMove)
      .on('click', this.onStageMouseClick)

    pulleys.forEach((pulley, pulleyIndex) => {
      const nextPulley = pulleyIndex === pulleys.length - 1 ? pulleys[0] : pulleys[pulleyIndex + 1]
      const prevPulley = pulleyIndex === 0 ? pulleys[pulleys.length - 1] : pulleys[pulleyIndex - 1]
      const tangents = getTangents(pulley, nextPulley)

      const pulleyGeometry = new Konva.Circle({
        data: {
          nextPulleyId: nextPulley.id,
          prevPulleyId: prevPulley.id,
          rotation: pulley.rotation,
        },
        id: pulley.id,
        x: pulley.x,
        y: pulley.y,
        radius: pulley.radius,
        fill: '#eee',
        stroke: '#888',
        shadowForStrokeEnabled: false,
        draggable: true,
      }).on('click', this.onPulleyClick)
        .on('dragend', this.onPulleyPositionChange)

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

    const dropIndicator = new Konva.Circle({
      id: 'dropIndicator',
      x: 0,
      y: 0,
      radius: 20,
      fill: '#eee',
      stroke: '#888',
      shadowForStrokeEnabled: false,
      opacity: 0,
    })

    layer.add(dropIndicator)
    stage.add(layer)
    layer.draw()
  }

  render() {
    const selectedPulley = this.state.pulleys.find(p => p.id === this.state.selectedPulleyId)

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

            <div id="Designer"></div>

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
}
