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
    const {
      pulley,
      onMove,
      onSelect,
    } = this.props
    log(`render Pulley ${pulley.id}`)

    if(pulley.type === PULLEY_TYPE.POINT_ON_CONVEYOR) {
      return (
        <Group
          id={pulley.id}
          x={pulley.x}
          y={pulley.y}
          draggable
          onDragEnd={onMove}
          onClick={onSelect}
        >
          <Line
            points={[0, -10, 0, 10]}
            stroke={pulley.isSelected ? '#ff9089' : '#888'}
            shadowForStrokeEnabled={false}
          />
          <Line
            points={[-10, 0, 10, 0]}
            stroke={pulley.isSelected ? '#ff9089' : '#888'}
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
          stroke={pulley.isSelected ? '#ff9089' : '#888'}
          shadowForStrokeEnabled={false}
          draggable
          onDragEnd={onMove}
          onClick={onSelect}
        />
      )
    }
  }
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
    const {beltSection} = this.props
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
        stroke={beltSection.isSelected ? '#ff9089' : "#888"}
        shadowForStrokeEnabled={false}
      />
    )
  }
}

export class Designer extends React.Component {
  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props, newProps)
  }

  render() {
    log('render Designer')

    const {
      pulleys,
      beltSections,
      dropItem,
      dropIndicator,

      onPulleyMove,
      onPulleySelect,

      onStageMouseMove,
      onStageMouseLeave,
      onStageClick,
      onZoom,
    } = this.props
    
    return (
      <Stage
        width={1200}
        height={600}
        onMouseMove={onStageMouseMove}
        onMouseLeave={onStageMouseLeave}
        onClick={onStageClick}
        onWheel={onZoom}
        draggable
      >
        <Layer>
          {beltSections.map(beltSection => <BeltSection key={beltSection.id} beltSection={beltSection}/>)}
          {pulleys.map(pulley => (
            <Pulley
              key={pulley.id}
              pulley={pulley}
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
}
