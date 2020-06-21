import React from 'react'

export const DataTable = ({pulleys, selectedPulleyId, onPulleyRadiusChange, onPulleyXChange, onPulleyYChange}) => {
  return pulleys.length > 0 ? (
    <div id="DataTable">
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
          <tr
            key={pulley.id}
            className={pulley.id === selectedPulleyId ? 'selected' : ''}
          >
            <td>{pulley.id}</td>
            <td>
              <input
                type="number"
                value={pulley.x}
                onChange={e => onPulleyXChange(pulley.id, e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                value={pulley.y}
                onChange={e => onPulleyYChange(pulley.id, e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                value={pulley.radius}
                onChange={e => onPulleyRadiusChange(pulley.id, e.target.value)}
              />
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  ) : null
}
