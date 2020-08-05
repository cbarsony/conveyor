import React from 'react'
import update from 'immutability-helper'
import {Stage, Layer, Circle} from 'react-konva'

class Pulley extends React.Component {
  shouldComponentUpdate(newProps) {
    return this.props.circle !== newProps.circle
  }

  render() {
    const {circle} = this.props
    console.log('render', circle.id)

    return (
      <Circle
        x={circle.x}
        y={circle.y}
        radius={circle.radius}
        fill={circle.fill}
      />
    )
  }
}

export class Test extends React.Component {
  state = {
    circles: [
      {id: 'red', x: 100, y: 100, radius: 20, fill: '#e00'},
      {id: 'green', x: 300, y: 100, radius: 20, fill: '#0e0'},
    ],
  }

  render() {
    return (
      <div>
        <button
          onClick={() => {
            this.setState(state => update(state, {
              circles: {
                [0]: {
                  x: {
                    $set: Math.random() * 400 + 50,
                  },
                },
              },
            }))
          }}
        >Click me!</button>
        <Stage
          width={800}
          height={600}
        >
          <Layer>
            {this.state.circles.map((circle, circleIndex) => (
              <Pulley
                key={circleIndex}
                circle={circle}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    )
  }
}
