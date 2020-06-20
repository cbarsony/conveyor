import React from 'react'

export const DataTable = ({pulleys}) => {
  return pulleys.length > 0 ? (
    <table>
      <thead>
      <tr>
        <th>Pulley</th>
        <th>X</th>
        <th>Y</th>
        <th>Radius</th>
      </tr>
      </thead>
      <tbody>
      {pulleys.map(pulley => (
        <tr key={pulley.id}>
          <td>{pulley.id}</td>
          <td>{pulley.x.toPrecision(9)}</td>
          <td>{pulley.y.toPrecision(9)}</td>
          <td>{pulley.radius}</td>
        </tr>
      ))}
      </tbody>
    </table>
  ) : null
}
