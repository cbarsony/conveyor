/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react'
import update from 'immutability-helper'
import _ from 'lodash'

import {Designer} from './Designer'
import {uuid} from './uuid'

export const ROTATION = {
  CLOCKWISE: 'CLOCKWISE',
  ANTICLOCKWISE: 'ANTICLOCKWISE',
}

export const App = () => {
  /*const [pulleys, setPulleys] = React.useState([
    {
      x: 200,
      y: 250,
      radius: 20,
      rotation: ROTATION.CLOCKWISE,
    },
    {
      x: 1000,
      y: 250,
      radius: 50,
      rotation: ROTATION.CLOCKWISE,
    },
  ])*/
  const [pulleys, setPulleys] = React.useState(_.range(5).map(n => ({
    id: uuid(),
    x: Math.random() * 1200,
    y: Math.random() * 600,
    radius: Math.random() * 30 + 10,
    rotation: Math.random() > 0.5 ? ROTATION.CLOCKWISE : ROTATION.ANTICLOCKWISE,
  })))
  const [dropItem, setDropItem] = React.useState(null)

  return (
    <div className="App">

      <nav className="navbar">
        <div className="navbar-brand">
          <h1 className="App__heading">Conveyor Designer</h1>
          <div className="navbar-burger burger" data-target="navbarExampleTransparentExample">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="navbarExampleTransparentExample" className="navbar-menu">
          <div className="navbar-start">
            <a className="navbar-item" href="#">Home</a>
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link" href="#">About Us</a>
              <div className="navbar-dropdown is-boxed">
                <a className="navbar-item" href="#">Our Team</a>
                <a className="navbar-item" href="#">Our Story</a>
                <a className="navbar-item" href="#">Locations</a>
              </div>
            </div>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="field is-grouped">
                <p className="control">
                  <a className="button is-primary" href="#">
                    <span className="icon">
                      <i className="far fa-envelope-open"></i>
                    </span>
                    <span>Contact</span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <section className="section">
        <div className="container App__content">
          <div id="GraphicsContainer">
            <button
              onClick={() => {
                setDropItem(dropItem => {
                  if(dropItem === 'Pulley') {
                    return null
                  }
                  else {
                    return 'Pulley'
                  }
                })
              }}
            >{dropItem === 'Pulley' ? 'Cancel' : 'Add Pulley'}</button>
            <Designer
              pulleys={pulleys}
              dropItem={dropItem}
              onPulleyDrop={(dropPoint, pulleyIndex) => {
                setPulleys(pulleys => update(pulleys, {
                  $splice: [[pulleyIndex + 1, 0, {
                    x: dropPoint.x,
                    y: dropPoint.y,
                    radius: 20,
                    rotation: ROTATION.CLOCKWISE,
                  }]]
                }))
              }}
              onPulleyMove={(pulleyIndex, x, y) => {
                setPulleys(pulleys => update(pulleys, {
                  [pulleyIndex]: {
                    x: {
                      $set: x,
                    },
                    y: {
                      $set: y,
                    },
                  },
                }))
              }}
            />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            <strong>&copy; 2020 Conveyor Designer. All Rights Reserved.</strong>
          </p>
        </div>
      </footer>

    </div>
  )
}
