import React from 'react'

import {Conveyor} from './model'
import {Designer} from './Designer'

export const App = () => {
  const [conveyor, setConveyor] = React.useState(new Conveyor())

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
            <Designer conveyor={conveyor}/>
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
