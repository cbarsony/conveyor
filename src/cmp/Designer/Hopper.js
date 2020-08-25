import React from 'react'

import {Line} from 'react-konva'

export class Hopper extends React.Component {
  render() {
    const {x, y, onClick} = this.props

    return (
      <Line
        points={[x, y, x - 10, y + 13, x + 10, y + 13]}
        closed
        stroke="#888"
        strokeWidth={2}
        strokeScaleEnabled={false}
        fill="#eee"
        onClick={onClick}
      />
    )
  }
}
