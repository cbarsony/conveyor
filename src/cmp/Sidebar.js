import React from 'react'
import PropTypes from 'prop-types'

import {Pulley} from '../utils/types'
import {designer} from '../designer'
import {ROTATION} from '../utils/types'

export const Sidebar = ({pulley, onPulleyAttributeChange, onDeletePulley, onRotationChange}) => {
  const onInputChange = (e, attribute) => {
    const value = Number(e.target.value)

    //TODO: refactor!
    designer.changePulleyAttribute(pulley.id, attribute, value)

    onPulleyAttributeChange(attribute, value)
  }

  return (
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
                  onChange={e => onInputChange(e, 'x')}
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
                  onChange={e => onInputChange(e, 'y')}
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
                  onChange={e => onInputChange(e, 'radius')}
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
}

Sidebar.propTypes = {
  pulley: PropTypes.shape(Pulley),
  onPulleyAttributeChange: PropTypes.func.isRequired,
  onDeletePulley: PropTypes.func.isRequired,
  onRotationChange: PropTypes.func.isRequired,
}
