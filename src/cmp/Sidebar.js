import React from 'react'
import PropTypes from 'prop-types'

import {Pulley} from '../utils/types'
import {designer} from '../designer'

export const Sidebar = ({selectedPulley, onPulleyAttributeChange, onDeletePulley}) => {
  const onInputChange = (e, attribute) => {
    const value = Number(e.target.value)

    //TODO: refactor!
    designer.changePulleyAttribute(selectedPulley.id, attribute, value)

    onPulleyAttributeChange(attribute, value)
  }

  return (
    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div className="sidebar-sticky pt-3">
        {selectedPulley && (
          <form>
            <div className="form-group row">
              <div className="col-sm-2">Id:</div>
              <div className="col-sm-10">{selectedPulley.id}</div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputX" className="col-sm-2 col-form-label">X:</label>
              <div className="col-sm-10">
                <input
                  type="number"
                  className="form-control"
                  id="inputX"
                  value={selectedPulley.x}
                  onChange={e => onInputChange(e, 'x')}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputY" className="col-sm-2 col-form-label">Y:</label>
              <div className="col-sm-10">
                <input
                  type="number"
                  className="form-control"
                  id="inputY"
                  value={selectedPulley.y}
                  onChange={e => onInputChange(e, 'y')}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputRadius" className="col-sm-2 col-form-label">Radius:</label>
              <div className="col-sm-10">
                <input
                  type="number"
                  className="form-control"
                  id="inputRadius"
                  value={selectedPulley.radius}
                  onChange={e => onInputChange(e, 'radius')}
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-2"></div>
              <div className="col-sm-10">
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
  selectedPulley: PropTypes.shape(Pulley),
  onPulleyAttributeChange: PropTypes.func.isRequired,
  onDeletePulley: PropTypes.func.isRequired,
}
