import React from 'react'
import _ from 'lodash'

import {Line} from 'react-konva'
import {log} from '../../utils/log'

export class BeltSection extends React.Component {
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
