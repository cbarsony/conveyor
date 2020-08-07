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
      <th scope="col">Wrap angle</th>
    </tr>
    </thead>
    <tbody>
    {pulleys.map(pulley => {
      const belt = beltSections.find(b => b.pulleyId === pulley.id)
      const nextPulley = pulleys.find(p => p.id === belt.nextPulleyId)
      const nextBelt = beltSections.find(b => b.pulleyId === nextPulley.id)
      const beltLength = getDistanceOfTwoPoints(belt.start, belt.end)
      const beltAngle = getAngleOfTwoPoints(belt.start, belt.end) * 180 / Math.PI
      const nextBeltAngle = getAngleOfTwoPoints(nextBelt.start, nextBelt.end) * 180 / Math.PI
      const wrapAngle = (beltAngle + (360 - nextBeltAngle)) % 360

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
          <td>{wrapAngle.toFixed(2)}&#176;</td>
        </tr>
      )
    })}
    </tbody>
  </table>
)
