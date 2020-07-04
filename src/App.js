import React from 'react'
import _ from 'lodash'

import {Conveyor, Pulley, Point, FreeBeltSection} from './model'
import {Designer} from './Designer'

export const App = () => {
  const [conveyor, setConveyor] = React.useState(new Conveyor())
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
              conveyor={conveyor}
              dropItem={dropItem}
              onPulleyDrop={(location, partIndex) => {
                setConveyor(conveyor => {
                  const previousPart = partIndex === 0 ? conveyor.parts[conveyor.parts.length - 1] : conveyor.parts[partIndex - 1]
                  const nextPart = partIndex === conveyor.parts.length - 1 ? conveyor.parts[0] : conveyor.parts[partIndex + 1]
                  const newPulley = new Pulley(new Point(location.x, location.y))
                  const firstNewBeltSection = new FreeBeltSection(previousPart, newPulley)
                  const secondNewBeltSection = new FreeBeltSection(newPulley, nextPart)
                  conveyor.parts.splice(partIndex, 1, firstNewBeltSection, newPulley, secondNewBeltSection)
                  return _.cloneDeep(conveyor)
                })
              }}
              onPulleyMove={(pulleyId, location) => {
                setConveyor(conveyor => {
                  const pulley = conveyor.parts.find(p => p.id === pulleyId)
                  pulley.location.x = location.x
                  pulley.location.y = location.y
                  return _.cloneDeep(conveyor)
                })
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
