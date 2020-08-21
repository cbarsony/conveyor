import React from 'react'
import _ from 'lodash'

import {ROTATION, PULLEY_TYPE} from '../utils/types'
import {getDistanceOfTwoPoints, getAngleOfTwoPoints} from '../utils/calculator'

export const DataTable = ({
  pulleys,
  selectedPulleyId,
  beltSections,
  onPulleyAttributeChange,
  onRotationChange,
  onTypeChange,
}) => (
  <table id="DataTable" className="table table-striped table-sm">
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
      const prevPulleyIndex = pulleyIndex === 0 ? pulleys.length - 1 : pulleyIndex - 1
      const prevPulley = pulleys[prevPulleyIndex]

      const nextPulleyIndex = pulleyIndex === pulleys.length - 1 ? 0 : pulleyIndex + 1
      const nextPulley = pulleys[nextPulleyIndex]

      const belt = pulley.getBeltSection(nextPulley)
      const prevBelt = prevPulley.getBeltSection(pulley)

      const beltLength = getDistanceOfTwoPoints(belt.start, belt.end)
      const beltAngle = getAngleOfTwoPoints(belt.start, belt.end) * 180 / Math.PI
      const prevBeltAngle = getAngleOfTwoPoints(prevBelt.start, prevBelt.end) * 180 / Math.PI
      const contactAngleValue = (beltAngle + (360 - prevBeltAngle)) % 360
      const contactAngle = pulley.rotation === ROTATION.CLOCKWISE ?  contactAngleValue : 360 - contactAngleValue
      const contactLength = (pulley.radius * 2 * Math.PI) / ((Math.PI * 2) / (contactAngle * Math.PI / 180))

      return (
        <tr key={pulley.id} className={pulley.id === selectedPulleyId ? 'selectedPulley' : ''}>
          <th scope="row">{pulley.id}</th>

          <td>
            <div className="input-group input-group-sm">
              <input
                type="number"
                className="form-control"
                aria-describedby="inputGroup-sizing-sm"
                value={pulley.x}
                onChange={e => onPulleyAttributeChange('x', Number(e.target.value), pulley.id)}
              />
            </div>
          </td>

          <td>
            <div className="input-group input-group-sm">
              <input
                type="number"
                className="form-control"
                aria-describedby="inputGroup-sizing-sm"
                value={pulley.y}
                onChange={e => onPulleyAttributeChange('y', Number(e.target.value), pulley.id)}
              />
            </div>
          </td>

          <td>
            {pulley.type === PULLEY_TYPE.IDLER ? '-' : (
              <div className="input-group input-group-sm">
                <input
                  type="number"
                  className="form-control"
                  min={1}
                  max={1000}
                  value={pulley.radius}
                  onChange={e => onPulleyAttributeChange('radius', Number(e.target.value), pulley.id)}
                />
              </div>
            )}
          </td>

          <td>
            {pulley.type === PULLEY_TYPE.IDLER ? '-' : (
              <div className="input-group input-group-sm">
                <select
                  id="inputRotation"
                  className="form-control"
                  value={pulley.rotation}
                  onChange={e => onRotationChange(e.target.value, pulley.id)}
                >
                  <option>{ROTATION.CLOCKWISE}</option>
                  <option>{ROTATION.ANTICLOCKWISE}</option>
                </select>
              </div>
            )}
          </td>

          <td>
            <div className="input-group input-group-sm">
              <select
                id="inputType"
                className="form-control"
                value={pulley.type}
                onChange={e => onTypeChange(e.target.value, pulley.id)}
              >
                {_.values(PULLEY_TYPE).map(pulleyType => (
                  <option key={pulleyType} value={pulleyType}>{pulleyType}</option>
                ))}
              </select>
            </div>
          </td>

          <td>
            {pulley.type === PULLEY_TYPE.DRIVE ? (
              <div className="input-group input-group-sm">
                <input
                  type="number"
                  className="form-control"
                  id="inputDriveCount"
                  min={1}
                  value={pulley.driveCount}
                  onChange={e => onPulleyAttributeChange('driveCount', Number(e.target.value), pulley.id)}
                />
              </div>
            ) : '-'}
          </td>

          <td>{beltLength.toFixed(2)}</td>
          <td>{beltAngle.toFixed(2)}&#176;</td>
          <td>{pulley.type === PULLEY_TYPE.IDLER ? '-' : contactLength.toFixed(2)}</td>
          <td>{pulley.type === PULLEY_TYPE.IDLER ? '-' : contactAngle.toFixed(2)}{pulley.type !== PULLEY_TYPE.IDLER && <span>&#176;</span>}</td>
        </tr>
      )
    })}
    </tbody>
  </table>
)
