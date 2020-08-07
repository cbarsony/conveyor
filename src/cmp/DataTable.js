import React from 'react'

import {PULLEY_TYPE} from '../utils/types'
import {getDistanceOfTwoPoints, getAngleOfTwoPoints} from '../utils/calculator'

export const DataTable = ({pulleys, beltSections}) => (
  <table className="table table-striped">
    <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">X</th>
      <th scope="col">Y</th>
      <th scope="col">Radius</th>
      <th scope="col">Rotation</th>
      <th scope="col">Type</th>
      <th scope="col">Drives</th>
      <th scope="col">Belt length</th>
      <th scope="col">Belt angle</th>
      <th scope="col">Contact length</th>
      <th scope="col">Contact angle</th>
    </tr>
    </thead>
    <tbody>
    {pulleys.map((pulley, pulleyIndex) => {
      const belt = beltSections.find(b => b.pulleyId === pulley.id)
      const prevPulleyIndex = pulleyIndex === 0 ? pulleys.length - 1 : pulleyIndex - 1
      const prevPulley = pulleys[prevPulleyIndex]
      const prevBelt = beltSections.find(b => b.pulleyId === prevPulley.id)
      const beltLength = getDistanceOfTwoPoints(belt.start, belt.end)
      const beltAngle = getAngleOfTwoPoints(belt.start, belt.end) * 180 / Math.PI
      const prevBeltAngle = getAngleOfTwoPoints(prevBelt.start, prevBelt.end) * 180 / Math.PI
      const contactAngle = (beltAngle + (360 - prevBeltAngle)) % 360
      const contactLength = (pulley.radius * 2 * Math.PI) / ((Math.PI * 2) / (contactAngle * Math.PI / 180))

      return (
        <tr key={pulley.id} className={pulley.isSelected ? 'selectedPulley' : ''}>
          <th scope="row">{pulley.id}</th>
          <td>{pulley.x}</td>
          <td>{pulley.y}</td>
          <td>{pulley.type === PULLEY_TYPE.POINT_ON_CONVEYOR ? '-' : pulley.radius}</td>
          <td>{pulley.type === PULLEY_TYPE.POINT_ON_CONVEYOR ? '-' : pulley.rotation}</td>
          <td>{pulley.type === PULLEY_TYPE.POINT_ON_CONVEYOR ? 'POINT' : pulley.type}</td>
          <td>{pulley.type === PULLEY_TYPE.DRIVE_PULLEY ? pulley.driveCount : '-'}</td>
          <td>{beltLength.toFixed(2)}</td>
          <td>{beltAngle.toFixed(2)}&#176;</td>
          <td>{pulley.type === PULLEY_TYPE.POINT_ON_CONVEYOR ? '-' : contactLength.toFixed(2)}</td>
          <td>{pulley.type === PULLEY_TYPE.POINT_ON_CONVEYOR ? '-' : contactAngle.toFixed(2)}{pulley.type !== PULLEY_TYPE.POINT_ON_CONVEYOR && <span>&#176;</span>}</td>
        </tr>
      )
    })}
    </tbody>
  </table>
)
