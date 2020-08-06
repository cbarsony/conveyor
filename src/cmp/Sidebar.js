import React from 'react'

import {ROTATION} from '../utils/types'

export const Sidebar = ({pulley, onPulleyAttributeChange, onDeletePulley, onRotationChange}) => (
  <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
    <div className="sidebar-sticky pt-3">
      {pulley && (
        <form>
          <div className="form-group row">
            <div className="col-sm-3">Id:</div>
            <div className="col-sm-9">{pulley.id}</div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputX" className="col-sm-3 col-form-label">X:</label>
            <div className="col-sm-9">
              <input
                type="number"
                className="form-control"
                id="inputX"
                value={pulley.x}
                onChange={e => onPulleyAttributeChange('x', Number(e.target.value))}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputY" className="col-sm-3 col-form-label">Y:</label>
            <div className="col-sm-9">
              <input
                type="number"
                className="form-control"
                id="inputY"
                value={pulley.y}
                onChange={e => onPulleyAttributeChange('y', Number(e.target.value))}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputRadius" className="col-sm-3 col-form-label">Radius:</label>
            <div className="col-sm-9">
              <input
                type="number"
                className="form-control"
                id="inputRadius"
                value={pulley.radius}
                onChange={e => onPulleyAttributeChange('radius', Number(e.target.value))}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputRotation" className="col-sm-3 col-form-label">Rotation:</label>
            <div className="col-sm-9">
              <select
                id="inputRotation"
                className="form-control"
                value={pulley.rotation}
                onChange={e => onRotationChange(e.target.value)}
              >
                <option>{ROTATION.CLOCKWISE}</option>
                <option>{ROTATION.ANTICLOCKWISE}</option>
              </select>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-3"></div>
            <div className="col-sm-9">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={onDeletePulley}
              >Delete Pulley</button>
            </div>
          </div>
        </form>
      )}
    </div>
  </nav>
)
