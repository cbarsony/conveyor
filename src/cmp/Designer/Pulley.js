import React from 'react'

import {Circle, Line, Group} from 'react-konva'
import {log} from '../../utils/log'
import {PULLEY_TYPE} from '../../utils/types'

export class Pulley extends React.Component {

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
