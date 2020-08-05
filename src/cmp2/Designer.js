import React from 'react'
import {Stage, Layer, Circle, Line} from 'react-konva'

class Pulley extends React.Component {
  shouldComponentUpdate(newProps) {
    return this.props.circle !== newProps.circle
  }

  render() {
    const {pulley} = this.props
    console.log('render', pulley.id)

    return (
      <Circle
        id={pulley.id}
        x={pulley.x}
        y={pulley.y}
        radius={pulley.radius}
        fill="#eee"
        stroke="#888"
        shadowForStrokeEnabled={false}
      />
    )
  }
}

class BeltSection extends React.Component {
  shouldComponentUpdate(newProps) {
    return this.props.beltSection !== newProps.beltSection
  }

  render() {
    const {beltSection} = this.props
    console.log('render', beltSection.id)

    return (
      <Line
        id={beltSection.id}
        points={[
          beltSection.start.x,
          beltSection.start.y,
          beltSection.end.x,
          beltSection.end.y,
        ]}
        stroke="#888"
        shadowForStrokeEnabled={false}
      >

      </Line>
    )
  }
}

export class Designer extends React.Component {
  render() {
    const {pulleys, beltSections} = this.props

    return (
      <Stage
        width={1200}
        height={600}
      >
        <Layer>
          {pulleys.map(pulley => (
            <Pulley
              key={pulley.id}
              pulley={pulley}
            />
          ))}
          {beltSections.map(beltSection => (
            <BeltSection
              key={beltSection.id}
              beltSection={beltSection}
            />
          ))}
        </Layer>
      </Stage>
    )
  }
}
