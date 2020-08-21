import React from 'react'
import update from 'immutability-helper'
import _ from 'lodash'
import {Stage, Layer, Circle, Line, Group, Text, Rect} from 'react-konva'

import {PULLEY_TYPE, HOPPER_TYPE} from '../utils/types'

const log = message => {
  // console.log(message)
}

const closestLess = (a, b) => a - (a % b)
const closestGreater = (a, b) => (a + b) - (a % b)

class Pulley extends React.Component {

/*
  shouldComponentUpdate(newProps, newState) {
    return true
    return !_.isEqual(this.props, newProps) && !_.isEqual(this.state, newState)
  }
*/

  render() {
    log(`render Pulley ${this.props.pulley.id}`)

    const pulley = (
      <Circle
        id={this.props.pulley.id}
        x={this.props.pulley.x}
        y={this.props.pulley.y}
        radius={this.props.pulley.radius}
        fill="#eee"
        stroke={this.props.isSelected ? '#ff9089' : '#888'}
        shadowForStrokeEnabled={false}
        draggable
        onDragEnd={this.onDragEnd}
        onClick={this.onClick}
        strokeWidth={2}
        strokeScaleEnabled={false}
      />
    )

    const idler = (
      <Group
        id={this.props.pulley.id}
        x={this.props.pulley.x}
        y={this.props.pulley.y}
        draggable
        onDragEnd={this.onDragEnd}
        onClick={this.onClick}
      >
        <Line
          points={[0, -10, 0, 10]}
          stroke={this.props.isSelected ? '#ff9089' : '#888'}
          shadowForStrokeEnabled={false}
          strokeWidth={3}
          strokeScaleEnabled={false}
        />
        <Line
          points={[-10, 0, 10, 0]}
          stroke={this.props.isSelected ? '#ff9089' : '#888'}
          shadowForStrokeEnabled={false}
          strokeWidth={3}
          strokeScaleEnabled={false}
        />
        <Circle
          id={this.props.pulley.id}
          radius={20}
          shadowForStrokeEnabled={false}
          strokeScaleEnabled={false}
          opacity={0}
        />
      </Group>
    )


    return this.props.pulley.type === PULLEY_TYPE.IDLER ? idler : pulley
  }

  onDragEnd = ({target}) => this.props.onMove(target.id(), Math.round(target.x()), Math.round(target.y()))

  onClick = ({target}) => this.props.onSelect(target.id())
}

class DropIndicator extends React.Component {
  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props, newProps)
  }

  render() {
    const {x, y, type} = this.props
    log('render DropIndicator')

    if(type === PULLEY_TYPE.IDLER || type === HOPPER_TYPE.FEED || type === HOPPER_TYPE.DISCHARGE) {
      return (
        <Group
          id="drop-indicator"
          x={x}
          y={y}
          shadowForStrokeEnabled={false}
          strokeWidth={2}
          strokeScaleEnabled={false}
        >
          <Line
            points={[0, -10, 0, 10]}
            stroke="#888"
            strokeWidth={2}
            strokeScaleEnabled={false}
          />
          <Line
            points={[-10, 0, 10, 0]}
            stroke="#888"
            strokeWidth={2}
            strokeScaleEnabled={false}
          />
        </Group>
      )
    }
    else {
      return (
        <Circle
          id="drop-indicator"
          x={x}
          y={y}
          radius={20}
          fill="#eee"
          stroke="#888"
          shadowForStrokeEnabled={false}
          opacity={0.5}
          strokeWidth={2}
          strokeScaleEnabled={false}
        />
      )
    }
  }
}

//This is a nice one!
class BeltSection extends React.Component {
  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props, newProps)
  }

  render() {
    const {beltSection, isSelected} = this.props
    log(`render Belt ${beltSection.id}`)

    return (
      <Line
        id={beltSection.id}
        points={[
          beltSection.start.x,
          beltSection.start.y,
          beltSection.end.x,
          beltSection.end.y,
        ]}
        stroke={isSelected ? '#ff9089' : "#888"}
        shadowForStrokeEnabled={false}
        strokeWidth={2}
        strokeScaleEnabled={false}
      />
    )
  }
}

class Hopper extends React.Component {
  render() {
    const {x, y} = this.props

    return (
      <Line
        points={[x, y, x - 10, y + 13, x + 10, y + 13]}
        closed
        stroke="#888"
        strokeWidth={2}
        strokeScaleEnabled={false}
        fill="#eee"
      />
    )
  }
}

class Grid extends React.Component {
  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props, newProps)
  }

  render() {
    const left = this.props.x / this.props.scale * -1
    const right = left + 1200 / this.props.scale
    const top = this.props.y / this.props.scale
    const bottom = top - 600 / this.props.scale
    let divisor = 100

    if(this.props.scale < 0.05) {
      divisor = 5000
    }
    else if(this.props.scale < 0.1) {
      divisor = 1000
    }
    else if(this.props.scale < 0.3) {
      divisor = 500
    }
    else if(this.props.scale < 1) {
      divisor = 100
    }
    else if(this.props.scale < 2) {
      divisor = 50
    }
    else if(this.props.scale < 5) {
      divisor = 10
    }
    else if(this.props.scale < 30) {
      divisor = 5
    }
    else {
      divisor = 1
    }

    const bounds = {
      left: closestLess(left, divisor) - divisor,
      right: closestGreater(right, divisor),
      top: closestGreater(top, divisor),
      bottom: closestLess(bottom, divisor) - divisor,
    }
    if(isNaN(bounds.left)) {
      debugger
    }
    let result = []
    const fontSize = 1 / this.props.scale * 10

    const verticalLines = _.range(bounds.left, bounds.right, divisor).map(i => {
      return (
        <React.Fragment
          key={`grid_v_${i}`}
        >
          <Line
            stroke="#aaa"
            points={[i, bounds.top, i, bounds.bottom]}
            dash={i % (5 * divisor) === 0 ? [] : [2, 3]}
            strokeWidth={i === 0 ? 1 : 0.5}
            shadowForStrokeEnabled={false}
            strokeScaleEnabled={false}
          />
          <Text
            text={i}
            x={i}
            y={fontSize}
            scaleY={-1}
            fontSize={fontSize}
          />
        </React.Fragment>
      )
    })

    const horizontalLines = _.range(bounds.bottom, bounds.top, divisor).map(i => (
        <React.Fragment
          key={`grid_h_${i}`}
        >
          <Line
            stroke="#aaa"
            points={[bounds.left, i, bounds.right, i]}
            dash={i % (5 * divisor) === 0 ? [] : [2, 3]}
            strokeWidth={i === 0 ? 1 : 0.5}
            shadowForStrokeEnabled={false}
            strokeScaleEnabled={false}
          />
          <Text
            text={i !== 0 ? i : null}
            x={0}
            y={i + fontSize}
            scaleY={-1}
            fontSize={fontSize}
          />
        </React.Fragment>
      )
    )

    return [...verticalLines, ...horizontalLines]

    _.range(-100, 100).forEach(i => {
      const horizontalPoints = [-10000, i * -100, 10000, i * -100]
      const verticalPoints = [i * 100, 10000, i * 100, -10000]

      result.push(
        <Line
          key={`grid_h_${i}`}
          points={horizontalPoints}
          dash={i % 5 === 0 ? [] : [2, 3]}
          stroke="#aaa"
          shadowForStrokeEnabled={false}
          strokeWidth={i === 0 ? 1 : 0.5}
          strokeScaleEnabled={false}
        />
      )

      result.push(
        <Line
          key={`grid_v_${i}`}
          points={verticalPoints}
          dash={i % 5 === 0 ? [] : [2, 3]}
          stroke="#aaa"
          shadowForStrokeEnabled={false}
          strokeWidth={i === 0 ? 1 : 0.5}
          strokeScaleEnabled={false}
        />
      )

      result.push(
        <Text
          key={`label_v_${i}`}
          text={i * 100}
          x={0}
          y={i * 100 + 10}
          scaleY={-1}
        />
      )

      if(i !== 0) {
        result.push(
          <Text
            key={`label_h_${i}`}
            text={i * 100}
            x={i * 100}
            y={10}
            scaleY={-1}
          />
        )
      }
    })

    return result
  }
}

export class Designer extends React.Component {
  state = {
    selection: null,
  }

  render() {
    log('render Designer')

    const {
      pulleys,
      selectedPulleyId,
      dropItem,
      dropIndicator,
      isGridVisible,

      onPulleyMove,
      onPulleySelect,
      onStageMouseLeave,
      onStageClick,
    } = this.props
    
    return (
      <Stage
        id="stage"
        width={1200}
        height={600}
        onMouseMove={this.onMouseMove}
        onMouseLeave={onStageMouseLeave}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onClick={onStageClick}
        onWheel={this.onWheel}
        onContextMenu={this.onContextMenu}
        draggable
        y={600}
        scaleY={-1}
      >
        <Layer>
          {this.stage && isGridVisible && (
            <Grid
              x={this.stage.x()}
              y={this.stage.y()}
              scale={this.stage.scaleX()}
            />
          )}
          {pulleys.map((pulley, pulleyIndex) => {
            const nextPulleyIndex = pulleyIndex === pulleys.length - 1 ? 0 : pulleyIndex + 1
            const nextPulley = pulleys[nextPulleyIndex]
            const beltSection = pulley.getBeltSection(nextPulley)

            return (
              <BeltSection
                key={beltSection.pulleyId}
                beltSection={beltSection}
                isSelected={beltSection.pulleyId === selectedPulleyId}
              />
            )
          })}
          {pulleys.map(pulley => (
            <Pulley
              key={pulley.id}
              pulley={pulley}
              isSelected={pulley.id === selectedPulleyId}
              onMove={onPulleyMove}
              onSelect={onPulleySelect}
            />
          ))}
          {pulleys.map((pulley, pulleyIndex) => {
            const nextPulleyIndex = pulleyIndex === pulleys.length - 1 ? 0 : pulleyIndex + 1
            const nextPulley = pulleys[nextPulleyIndex]
            const hoppers = pulley.getHoppers(nextPulley)

            return hoppers.map(hopper => (
              <Hopper
                key={hopper.id}
                x={hopper.x}
                y={hopper.y}
              />
            ))
          })}
          {dropIndicator && (
            <DropIndicator
              x={dropIndicator.x}
              y={dropIndicator.y}
              type={dropItem}
            />
          )}
          {this.state.selection && (
            <Rect
              x={this.state.selection[0]}
              y={this.state.selection[1]}
              width={this.state.selection[2] - this.state.selection[0]}
              height={this.state.selection[3] - this.state.selection[1]}
              fill="#888"
              opacity={0.2}
            />
          )}
        </Layer>
      </Stage>
    )
  }

  //region Lifecycle

  componentDidMount() {
    this.stage = window.Konva.stages[0]
  }

/*
  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props, newProps)
  }
*/

  //endregion Lifecycle

  //region Callbacks

  onMouseMove = ({evt, target}) => {
    if(this.state.selection) {
      const stageX = (evt.layerX - this.stage.x()) / this.stage.scaleX()
      const stageY = (evt.layerY - this.stage.y()) / this.stage.scaleY()

      this.setState(state => update(state, {
        selection: {
          $splice: [[2, 2, stageX, stageY]],
        },
      }))
    }
    this.props.onStageMouseMove(evt.layerX, evt.layerY)
  }

  onWheel = ({evt}) => {
    evt.preventDefault()

    const oldScaleX = this.stage.scaleX()
    const oldScaleY = this.stage.scaleY()
    const scaleBy = 1.1
    const newScale = evt.deltaY < 0 ? oldScaleX * scaleBy : oldScaleX / scaleBy

    if(newScale < 0.01 || newScale > 100) {
      return
    }

    const pointer = this.stage.getPointerPosition()

    const mousePointTo = {
      x: (pointer.x - this.stage.x()) / oldScaleX,
      y: (pointer.y - this.stage.y()) / oldScaleY,
    }

    this.stage.scale({ x: newScale, y: -newScale })

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * -newScale,
    }
    this.stage.position(newPos)
    this.stage.batchDraw()
    this.forceUpdate()
  }

  onMouseDown = ({evt}) => {
    if(evt.button === 2) {
      const x = (evt.layerX - this.stage.x()) / this.stage.scaleX()
      const y = (evt.layerY - this.stage.y()) / this.stage.scaleY()

      this.setState({selection: [x, y, x, y,]})
    }
  }

  onMouseUp = ({evt}) => {
    const selectionHasWidth = () => this.state.selection[0] !== this.state.selection[2]
    const isSelectionReversed = () => this.state.selection[0] > this.state.selection[2]

    if(evt.button === 2) {
      if(selectionHasWidth()) {
        const scale = 1200 / Math.abs(this.state.selection[2] - this.state.selection[0])
        this.stage.scale({x: scale, y: scale * -1})

        const x = this.state.selection[isSelectionReversed() ? 2 : 0] * this.stage.scaleX() * -1
        const y = this.state.selection[isSelectionReversed() ? 3 : 1] * this.stage.scaleY() * -1

        this.stage.position({
          x,
          y,
        })

        this.stage.batchDraw()
      }

      this.setState({selection: null})
    }
  }

  onContextMenu = ({evt}) => {
    evt.preventDefault()
    return false
  }

  //endregion Callbacks
}
