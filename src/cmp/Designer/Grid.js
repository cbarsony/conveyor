import React from 'react'
import _ from 'lodash'

import {Line, Text} from 'react-konva'

const closestLess = (a, b) => a - (a % b)
const closestGreater = (a, b) => (a + b) - (a % b)

export class Grid extends React.Component {
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
  }
}
