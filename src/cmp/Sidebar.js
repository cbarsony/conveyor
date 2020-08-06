import React from 'react'

import {ROTATION, PULLEY_TYPE} from '../utils/types'

export const Sidebar = ({
  pulley,
  dropItem,
  onPulleyAttributeChange,
  onDeletePulley,
  onRotationChange,
  onTypeChange,
  onAddPulley,
}) => (
  <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
    <div className="sidebar-sticky pt-3 list-group">

      <button
        type="button"
        className="sidebarAddButton btn btn-sm btn-outline-secondary"
        onClick={() => onAddPulley(PULLEY_TYPE.POINT_ON_CONVEYOR)}
      >{dropItem === PULLEY_TYPE.POINT_ON_CONVEYOR ? 'Cancel' : 'Add Point'}</button>
      <button
        type="button"
        className="sidebarAddButton btn btn-sm btn-outline-secondary"
        onClick={() => onAddPulley(PULLEY_TYPE.PULLEY)}
      >{dropItem === PULLEY_TYPE.PULLEY ? 'Cancel' : 'Add Pulley'}</button>
      <button
        type="button"
        className="sidebarAddButton btn btn-sm btn-outline-secondary"
        onClick={() => onAddPulley(PULLEY_TYPE.DRIVE_PULLEY)}
      >{dropItem === PULLEY_TYPE.DRIVE_PULLEY ? 'Cancel' : 'Add Drive Pulley'}</button>

      {pulley && (
        <form>

          <hr/>

          <div className="form-group row">
            <div className="col-sm-3">#</div>
            <strong className="col-sm-9">{pulley.id}</strong>
          </div>

          <div className="form-group row">
            <label htmlFor="inputX" className="col-sm-3 col-form-label">X</label>
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
            <label htmlFor="inputY" className="col-sm-3 col-form-label">Y</label>
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

          {pulley.type !== PULLEY_TYPE.POINT_ON_CONVEYOR && (
            <React.Fragment>

              <div className="form-group row">
                <label htmlFor="inputRadius" className="col-sm-3 col-form-label">Radius</label>
                <div className="col-sm-9">
                  <input
                    type="number"
                    className="form-control"
                    id="inputRadius"
                    value={pulley.radius}
                    onChange={e => onPulleyAttributeChange('radius', Number(e.target.value))}
                    min={1}
                    max={1000}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="inputRotation" className="col-sm-3 col-form-label">Rotation</label>
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

            </React.Fragment>
          )}

          <div className="form-group row">
            <label htmlFor="inputType" className="col-sm-3 col-form-label">Type</label>
            <div className="col-sm-9">
              <select
                id="inputType"
                className="form-control"
                value={pulley.type}
                onChange={e => onTypeChange(e.target.value)}
              >
                <option value={PULLEY_TYPE.POINT_ON_CONVEYOR}>POINT</option>
                <option>{PULLEY_TYPE.PULLEY}</option>
                <option>{PULLEY_TYPE.DRIVE_PULLEY}</option>
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
              >Delete</button>
            </div>
          </div>

        </form>
      )}
    </div>
  </nav>
)
