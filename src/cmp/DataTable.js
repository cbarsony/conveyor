import React from 'react'

import {PULLEY_TYPE} from '../utils/types'

export const DataTable = ({pulleys}) => (
  <table className="table table-striped">
    <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">X</th>
      <th scope="col">Y</th>
      <th scope="col">Radius</th>
      <th scope="col">Rotation</th>
      <th scope="col">Type</th>
    </tr>
    </thead>
    <tbody>
    {pulleys.map(pulley => (
      <tr key={pulley.id} className={pulley.isSelected ? 'selectedPulley' : ''}>
        <th scope="row">{pulley.id}</th>
        <td>{pulley.x}</td>
        <td>{pulley.y}</td>
        <td>{pulley.type === PULLEY_TYPE.POINT_ON_CONVEYOR ? '-' : pulley.radius}</td>
        <td>{pulley.type === PULLEY_TYPE.POINT_ON_CONVEYOR ? '-' : pulley.rotation}</td>
        <td>{pulley.type === PULLEY_TYPE.POINT_ON_CONVEYOR ? 'POINT' : pulley.type}</td>
      </tr>
    ))}
    </tbody>
  </table>
)
