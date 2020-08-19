import React from 'react'
import _ from 'lodash'
import {Stage, Layer, Circle, Line, Group, Text} from 'react-konva'

import {PULLEY_TYPE, HOPPER_TYPE} from '../utils/types'

const log = message => {
  // console.log(message)
}

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
        points={[x, y, x - 10, y + 10, x + 10, y + 10]}
        closed
        stroke="#aaa"
        fill="#eee"
      />
    )
  }
}

class Grid extends React.Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    let result = []

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
        width={1200}
        height={600}
        onMouseMove={this.onMouseMove}
        onMouseLeave={onStageMouseLeave}
        onClick={onStageClick}
        onWheel={this.onWheel}
        draggable
        y={600}
        scaleY={-1}
      >
        <Layer>
          {isGridVisible && <Grid/>}
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
        </Layer>
      </Stage>
    )
  }

  //region Lifecycle

  componentDidMount() {
    this.stage = window.Konva.stages[0]
  }

  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props, newProps)
  }

  //endregion Lifecycle

  //region Callbacks

  onMouseMove = ({evt}) => this.props.onStageMouseMove(evt.layerX, evt.layerY)

  onWheel = ({evt}) => {
    evt.preventDefault()

    const oldScaleX = this.stage.scaleX()
    const oldScaleY = this.stage.scaleY()
    const scaleBy = 1.1
    const newScale = evt.deltaY < 0 ? oldScaleX * scaleBy : oldScaleX / scaleBy

    if(newScale < 0.1 || newScale > 10) {
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
  }

  //endregion Callbacks
}
