import React from 'react'
import _ from 'lodash'

// import {KonvaGraphics} from './KonvaGraphics'
import {DataTable} from './DataTable'
import {uuid} from './uuid'
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
            {/*<button
              onClick={() => setConveyor(conveyor => {
                conveyor.parts[0].location.x = 300
                return _.cloneDeep(conveyor)
              })}
            >XXX</button>*/}
            <Designer conveyor={conveyor}/>
          </div>
{/*
          <DataTable
            pulleys={pulleys}
            points={points}
            selectedPulleyId={selectedPulleyId}
            onPulleyRadiusChange={(pulleyId, radius) => setPulleys(pulleys => {
              pulleys.find(p => p.id === pulleyId).radius = radius
              return _.cloneDeep(pulleys)
            })}
            onPointXChange={(pointId, x) => setPoints(points => {
              points.find(p => p.id === pointId).x = x
              return _.cloneDeep(points)
            })}
            onPointYChange={(pointId, y) => setPoints(points => {
              points.find(p => p.id === pointId).y = y
              return _.cloneDeep(points)
            })}
            deletePoint={id => setPoints(points => {
              const index = points.findIndex(p => p.id === id)
              points.splice(index, 1)
              return _.cloneDeep(points)
            })}
          />
*/}
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

/*
  return (
    <div id="App">
      <div id="GraphicsContainer">
        <button
          onClick={() => setAddingPoint(!isAddingPoint)}
        >{isAddingPoint ? 'Cancel' : 'Add Point'}</button>
        <KonvaGraphics
          pulleys={pulleys}
          points={points}
          onPulleySelect={onPulleySelect}
          selectedPulleyId={selectedPulleyId}
          isAddingPoint={isAddingPoint}
          xaddPoint={(x, y) => setPoints(points => [...points, new Point(x, y)])}
          addPoint={addPoint}
        />
      </div>
      <DataTable
        pulleys={pulleys}
        points={points}
        selectedPulleyId={selectedPulleyId}
        onPulleyRadiusChange={(pulleyId, radius) => setPulleys(pulleys => {
          pulleys.find(p => p.id === pulleyId).radius = radius
          return _.cloneDeep(pulleys)
        })}
        onPointXChange={(pointId, x) => setPoints(points => {
          points.find(p => p.id === pointId).x = x
          return _.cloneDeep(points)
        })}
        onPointYChange={(pointId, y) => setPoints(points => {
          points.find(p => p.id === pointId).y = y
          return _.cloneDeep(points)
        })}
        deletePoint={id => setPoints(points => {
          const index = points.findIndex(p => p.id === id)
          points.splice(index, 1)
          return _.cloneDeep(points)
        })}
      />
      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            <strong>Bulma</strong> by <a href="https://jgthms.com">Jeremy Thomas</a>. The source code is licensed
            <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
            is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
          </p>
        </div>
      </footer>
    </div>
  )
*/
}

class Pulley {
  constructor(x, y, radius = 10) {
    this.id = uuid()
    this.x = x
    this.y = y
    this.radius = radius
  }
}

class Point {
  constructor(x, y) {
    this.id = uuid()
    this.x = x
    this.y = y
  }
}
