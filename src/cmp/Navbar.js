import React from 'react'

export const Navbar = ({isGridVisible, onChangeGridVisible}) => (
  <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
    {/*eslint-disable jsx-a11y/anchor-is-valid*/}
    <a className="navbar-brand col-md-3 col-lg-2 mr-0 px-3" href="#">CONVtek</a>
    <div id="ShowGrid" className="form-check">
      <input
        id="checkboxGridVisible"
        className="form-check-input"
        type="checkbox"
        checked={isGridVisible}
        onChange={e => onChangeGridVisible(e.target.checked)}
      />
        <label className="form-check-label" htmlFor="checkboxGridVisible">
          Show grid
        </label>
    </div>
  </nav>
)
