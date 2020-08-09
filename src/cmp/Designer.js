import React from 'react'
import _ from 'lodash'
import {Stage, Layer, Circle, Line, Group} from 'react-konva'

import {PULLEY_TYPE} from '../utils/types'

const log = message => {
  // console.log(message)
}

class Pulley extends React.Component {
  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props, newProps)
  }

  render() {
    const {pulley, isSelected} = this.props
    log(`render Pulley ${pulley.id}`)

    if(pulley.type === PULLEY_TYPE.POINT_ON_CONVEYOR) {
      return (
        <Group
          id={pulley.id}
          x={pulley.x}
          y={pulley.y}
          draggable
          onDragEnd={this.onDragEnd}
          onClick={this.onClick}
        >
          <Line
            points={[0, -10, 0, 10]}
            stroke={isSelected ? '#ff9089' : '#888'}
            shadowForStrokeEnabled={false}
          />
          <Line
            points={[-10, 0, 10, 0]}
            stroke={isSelected ? '#ff9089' : '#888'}
            shadowForStrokeEnabled={false}
          />
          <Circle
            id={pulley.id}
            radius={20}
            shadowForStrokeEnabled={false}
          />
        </Group>
      )
    }
    else {
      return (
        <Circle
          id={pulley.id}
          x={pulley.x}
          y={pulley.y}
          radius={pulley.radius}
          fill={pulley.type === PULLEY_TYPE.PULLEY ? '#eee' : '#bfdaa1'}
          stroke={isSelected ? '#ff9089' : '#888'}
          shadowForStrokeEnabled={false}
          draggable
          onDragEnd={this.onDragEnd}
          onClick={this.onClick}
        />
      )
    }
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

    if(type === PULLEY_TYPE.POINT_ON_CONVEYOR) {
      return (
        <Group
          id="drop-indicator"
          x={x}
          y={y}
          shadowForStrokeEnabled={false}
        >
          <Line
            points={[0, -10, 0, 10]}
            stroke="#888"
          />
          <Line
            points={[-10, 0, 10, 0]}
            stroke="#888"
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
      />
    )
  }
}

export class Designer extends React.Component {
  render() {
    log('render Designer')

    const {
      pulleys,
      selectedPulleyId,
      beltSections,
      dropItem,
      dropIndicator,

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
      >
        <Layer>
          {beltSections.map(beltSection => (
            <BeltSection
              key={beltSection.pulleyId}
              beltSection={beltSection}
              isSelected={beltSection.pulleyId === selectedPulleyId}
            />
          ))}
          {pulleys.map(pulley => (
            <Pulley
              key={pulley.id}
              pulley={pulley}
              isSelected={pulley.id === selectedPulleyId}
              onMove={onPulleyMove}
              onSelect={onPulleySelect}
            />
          ))}
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

  onMouseMove = ({evt}) => {
    this.props.onStageMouseMove(evt.layerX, evt.layerY)
  }

  onWheel = ({evt}) => {
    evt.preventDefault()
    const oldScale = this.stage.scaleX()
    const scaleBy = 1.1

    const pointer = this.stage.getPointerPosition()

    const mousePointTo = {
      x: (pointer.x - this.stage.x()) / oldScale,
      y: (pointer.y - this.stage.y()) / oldScale,
    }

    const newScale =
      evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy

    this.stage.scale({ x: newScale, y: newScale })

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    }
    this.stage.position(newPos)
    this.stage.batchDraw()
  }

  //endregion Callbacks
}
