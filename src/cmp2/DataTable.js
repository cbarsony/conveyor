import React from 'react'

export const DataTable = ({pulleys, selectedPulleyId}) => (
  <table className="table table-striped">
    <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">X</th>
      <th scope="col">Y</th>
      <th scope="col">Radius</th>
      <th scope="col">Rotation</th>
    </tr>
    </thead>
    <tbody>
    {pulleys.map(pulley => (
      <tr key={pulley.id} className={pulley.id === selectedPulleyId ? 'selectedPulley' : ''}>
        <th scope="row">{pulley.id}</th>
        <td>{pulley.x}</td>
        <td>{pulley.y}</td>
        <td>{pulley.radius}</td>
        <td>{pulley.rotation}</td>
      </tr>
    ))}
    </tbody>
  </table>
)
