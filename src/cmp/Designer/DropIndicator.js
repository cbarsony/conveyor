import React from 'react'
import _ from 'lodash'

import {Circle, Line, Group} from 'react-konva'
import {log} from '../../utils/log'
import {
  PULLEY_TYPE,
  HOPPER_TYPE,
} from '../../utils/types'

export class DropIndicator extends React.Component {
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
