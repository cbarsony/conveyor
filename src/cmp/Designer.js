import React from 'react'
import Konva from 'konva'
import PropTypes from 'prop-types'

import {uuid} from '../utils/uuid'
import {getTangents, getDistanceOfSectionAndPoint} from '../utils/calculator'
import {designer} from '../designer'
import {Pulley} from '../utils/types'
import {ROTATION} from '../utils/types'

let stage, layer

export class Designer extends React.Component {
  static propTypes = {
    pulleys: PropTypes.arrayOf(PropTypes.shape(Pulley)).isRequired,
    dropItem: PropTypes.bool.isRequired,
    selectedPulleyId: PropTypes.string,
    onPulleyMove: PropTypes.func.isRequired,
    onPulleyDrop: PropTypes.func.isRequired,
  }

  state = {
    pulleyDropPoint: {x: 0, y: 0},
    pulleyIdToDropAfter: null,
  }

  onStageMouseMove = ({evt}) => {
    if(this.props.dropItem) {
      const dropIndicator = stage.findOne('#dropIndicator')
      const pulleys = this.props.pulleys

      let smallestDistance = Number.MAX_SAFE_INTEGER
      let pulleyDropPoint = {x: 0, y: 0}
      let pulleyIdToDropAfter = null

      pulleys.forEach((pulley, pulleyIndex) => {
        const nextPulley = pulleyIndex === pulleys.length - 1 ? pulleys[0] : pulleys[pulleyIndex + 1]
        const tangents = getTangents(pulley, nextPulley)
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
    if(this.props.dropItem) {
      const dropIndicator = stage.findOne('#dropIndicator')
      dropIndicator.setAttr('opacity', 0)
      layer.draw()
    }
  }

  onStageMouseClick = () => {
    if(this.props.dropItem) {
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

      stage.children[0].add(newPulley)
      stage.children[0].add(prevLine)
      stage.children[0].add(nextLine)
      stage.children[0].draw()

      //
      this.props.onPulleyDrop(newPulleyId, this.state.pulleyDropPoint)

      this.setState({
        pulleyDropPoint: {x: 0, y: 0},
        pulleyIdToDropAfter: null,
      })
    }
  }

  onPulleyClick = ({target}) => {
    if(this.props.dropItem) {
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
    this.props.setSelectedPulleyId(target.attrs.id)
  }

  onPulleyPositionChange = ({target}) => {
    const id = target.attrs.id
    const pulley = stage.findOne(`#${id}`)
    const pulleyPosition = pulley.getPosition()

    designer.drawBeltsAfterPulleyPositionChange(id)

    this.props.onPulleyMove(target.attrs.id, Math.round(pulleyPosition.x), Math.round(pulleyPosition.y))
  }

  componentDidMount() {
    const {pulleys} = this.props

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
    return (
      <div id="Designer"></div>
    )
  }
}
