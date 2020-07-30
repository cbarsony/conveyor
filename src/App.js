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
  const [pulleys, setPulleys] = React.useState(_.range(5).map(n => ({
    id: uuid(),
    x: Math.round(Math.random() * 1200),
    y: Math.round(Math.random() * 600),
    radius: Math.round(Math.random() * 30 + 10),
    rotation: Math.random() > 1 ? ROTATION.CLOCKWISE : ROTATION.ANTICLOCKWISE,
  })))
  const [dropItem, setDropItem] = React.useState(null)
  const [selectedPulleyId, setSelectedPulleyId] = React.useState(null)
  const selectedPulley = pulleys.find(p => p.id === selectedPulleyId)

  return (
    <React.Fragment>

      <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-md-3 col-lg-2 mr-0 px-3" href="#">Conveyor Designer</a>
      </nav>

      <div id="Content" className="container-fluid row">

        <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div className="sidebar-sticky pt-3">
            {selectedPulleyId && (
              <form>
                <div className="form-group row">
                  <label htmlFor="inputX" className="col-sm-2 col-form-label">X:</label>
                  <div className="col-sm-10">
                    <input
                      type="number"
                      className="form-control"
                      id="inputX"
                      value={selectedPulley.x}
                      onChange={e => {
                        const value = e.target.value
                        const stage = window.Konva.stages[0]
                        stage.findOne(`#${selectedPulleyId}`).setAttr('x', value)
                        stage.children[0].draw()

                        setPulleys(pulleys => {
                          const pulleyIndex = pulleys.findIndex(p => p.id === selectedPulleyId)

                          return update(pulleys, {
                            [pulleyIndex]: {
                              x: {
                                $set: value,
                              },
                            },
                          })
                        })
                      }}
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
                      onChange={() => {}}
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
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
        </nav>

        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
          <div className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary mr-2"
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
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                const stage = window.Konva.stages[0]
                stage.findOne(`#${selectedPulleyId}`).setAttr('fill', '#eee')
                setSelectedPulleyId(null)
                stage.children[0].draw()
              }}
              disabled={!selectedPulley}
            >Deselect</button>
          </div>

          <Designer
            selectedPulleyId={selectedPulleyId}
            setSelectedPulleyId={id => setSelectedPulleyId(id)}
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
            onPulleyMove={(id, x, y) => {
              setPulleys(pulleys => update(pulleys, {
                [id]: {
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

        </main>
      </div>

      <footer className="footer mt-auto py-3">
        <div className="container">
          <span id="FooterMessage">&copy; 2020 Conveyor Designer. All Rights Reserved.</span>
        </div>
      </footer>

    </React.Fragment>
  )
}
