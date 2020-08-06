import React from 'react'
import _ from 'lodash'
import {Stage, Layer, Circle, Line} from 'react-konva'

class Pulley extends React.Component {
  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props.pulley, newProps.pulley)
  }

  render() {
    const {
      pulley,
      onMove,
      onSelect,
    } = this.props
    console.log('render Pulley', pulley.id)

    return (
      <Circle
        id={pulley.id}
        x={pulley.x}
        y={pulley.y}
        radius={pulley.radius}
        fill={pulley.isSelected ? '#ff9089' : '#eee'}
        stroke="#888"
        shadowForStrokeEnabled={false}
        draggable
        onDragEnd={onMove}
        onClick={onSelect}
      />
    )
  }
}

class DropIndicator extends React.Component {
  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props, newProps)
  }

  render() {
    const {x, y} = this.props
    console.log('render DropIndicator')

    return (
      <Circle
        id="drop-indicator"
        x={x}
        y={y}
        radius={20}
        fill="#eee"
        stroke="#888"
        shadowForStrokeEnabled={false}
      />
    )
  }
}

class BeltSection extends React.Component {
  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props, newProps)
  }

  render() {
    const {id, start, end} = this.props
    console.log('render Belt', id)

    return (
      <Line
        id={id}
        points={[
          start.x,
          start.y,
          end.x,
          end.y,
        ]}
        stroke="#888"
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
    console.log('render Designer')

    const {
      pulleys,
      beltSections,
      dropIndicator,
      onPulleyMove,
      onPulleySelect,
      onStageMouseMove,
      onStageMouseLeave,
      onStageClick,
    } = this.props
    
    return (
      <Stage
        width={1200}
        height={600}
        onMouseMove={onStageMouseMove}
        onMouseLeave={onStageMouseLeave}
        onClick={onStageClick}
      >
        <Layer>
          {dropIndicator && (
            <DropIndicator
              x={dropIndicator.x}
              y={dropIndicator.y}
            />
          )}
          {pulleys.map(pulley => (
            <Pulley
              key={pulley.id}
              pulley={pulley}
              onMove={onPulleyMove}
              onSelect={onPulleySelect}
            />
          ))}
          {beltSections.map(beltSection => (
            <BeltSection
              key={beltSection.id}
              id={beltSection.id}
              start={beltSection.start}
              end={beltSection.end}
            />
          ))}
        </Layer>
      </Stage>
    )
  }
}
