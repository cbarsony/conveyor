import React from 'react'

export const DataTable = (
  {
    pulleys,
    points,
    selectedPulleyId,
    onPulleyRadiusChange,
    onPointXChange,
    onPointYChange,
    deletePoint
  }) => {
  return points.length > 0 ? (
    <div id="DataTable">
      <table>
        <thead>
        <tr>
          <th>Point</th>
          <th>X</th>
          <th>Y</th>
        </tr>
        </thead>
        <tbody>
        {points.map((point, pointIndex) => (
          <tr
            key={pointIndex}
            className={point.id === selectedPulleyId ? 'selected' : ''}
          >
            <td>{pointIndex + 1}</td>
            <td>
              <input
                type="number"
                value={point.x}
                onChange={e => onPointXChange(point.id, Number(e.target.value))}
              />
            </td>
            <td>
              <input
                type="number"
                value={point.y}
                onChange={e => onPointYChange(point.id, Number(e.target.value))}
              />
            </td>
            <td>
              <button onClick={() => deletePoint(point.id)}>X</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  ) : null
}
