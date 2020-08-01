/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react'
import update from 'immutability-helper'
import _ from 'lodash'

import {Designer} from './Designer'
import {uuid} from './uuid'
import {getTangents} from './calculator'

export const ROTATION = {
  CLOCKWISE: 'CLOCKWISE',
  ANTICLOCKWISE: 'ANTICLOCKWISE',
}

export const App = () => {
  const [pulleys, setPulleys] = React.useState(_.range(3).map(n => ({
    id: uuid(),
    x: Math.round(Math.random() * 1100 + 50),
    y: Math.round(Math.random() * 500 + 50),
    radius: Math.round(Math.random() * 40 + 10),
    rotation: Math.random() > 0.5 ? ROTATION.CLOCKWISE : ROTATION.ANTICLOCKWISE,
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
                      onChange={e => {
                        const value = Number(e.target.value)
                        const stage = window.Konva.stages[0]
                        stage.findOne(`#${selectedPulleyId}`).setAttr('x', value)
                        stage.children[0].draw()

                        setPulleys(pulleys => {
                          const pulleyIndex = pulleys.findIndex(p => p.id === selectedPulleyId)

                          const pulley = stage.findOne(`#${selectedPulleyId}`)
                          const pulleyPosition = pulley.getPosition()

                          const nextPulley = stage.findOne(`#${pulley.attrs.data.nextPulleyId}`)
                          const nextPulleyPosition = nextPulley.getPosition()

                          const prevPulley = stage.findOne(`#${pulley.attrs.data.prevPulleyId}`)
                          const prevPulleyPosition = prevPulley.getPosition()

                          const prevLine = stage.findOne(`#belt_${prevPulley.attrs.id}`)
                          const prevLineTangents = getTangents({
                            x: prevPulleyPosition.x,
                            y: prevPulleyPosition.y,
                            radius: prevPulley.getRadius(),
                            rotation: prevPulley.attrs.data.rotation,
                          }, {
                            x: pulleyPosition.x,
                            y: pulleyPosition.y,
                            radius: pulley.getRadius(),
                            rotation: pulley.attrs.data.rotation,
                          })
                          prevLine.setAttr('points', [prevLineTangents.start.x, prevLineTangents.start.y, prevLineTangents.end.x, prevLineTangents.end.y,])

                          const nextLine = stage.findOne(`#belt_${pulley.attrs.id}`)
                          const nextLineTangents = getTangents({
                            x: pulleyPosition.x,
                            y: pulleyPosition.y,
                            radius: pulley.getRadius(),
                            rotation: pulley.attrs.data.rotation,
                          }, {
                            x: nextPulleyPosition.x,
                            y: nextPulleyPosition.y,
                            radius: nextPulley.getRadius(),
                            rotation: nextPulley.attrs.data.rotation,
                          })
                          nextLine.setAttr('points', [nextLineTangents.start.x, nextLineTangents.start.y, nextLineTangents.end.x, nextLineTangents.end.y,])

                          window.Konva.stages[0].children[0].draw()

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
                      onChange={e => {
                        const value = Number(e.target.value)
                        const stage = window.Konva.stages[0]
                        stage.findOne(`#${selectedPulleyId}`).setAttr('y', value)
                        stage.children[0].draw()

                        setPulleys(pulleys => {
                          const pulleyIndex = pulleys.findIndex(p => p.id === selectedPulleyId)

                          const pulley = stage.findOne(`#${selectedPulleyId}`)
                          const pulleyPosition = pulley.getPosition()

                          const nextPulley = stage.findOne(`#${pulley.attrs.data.nextPulleyId}`)
                          const nextPulleyPosition = nextPulley.getPosition()

                          const prevPulley = stage.findOne(`#${pulley.attrs.data.prevPulleyId}`)
                          const prevPulleyPosition = prevPulley.getPosition()

                          const prevLine = stage.findOne(`#belt_${prevPulley.attrs.id}`)
                          const prevLineTangents = getTangents({
                            x: prevPulleyPosition.x,
                            y: prevPulleyPosition.y,
                            radius: prevPulley.getRadius(),
                            rotation: prevPulley.attrs.data.rotation,
                          }, {
                            x: pulleyPosition.x,
                            y: pulleyPosition.y,
                            radius: pulley.getRadius(),
                            rotation: pulley.attrs.data.rotation,
                          })
                          prevLine.setAttr('points', [prevLineTangents.start.x, prevLineTangents.start.y, prevLineTangents.end.x, prevLineTangents.end.y,])

                          const nextLine = stage.findOne(`#belt_${pulley.attrs.id}`)
                          const nextLineTangents = getTangents({
                            x: pulleyPosition.x,
                            y: pulleyPosition.y,
                            radius: pulley.getRadius(),
                            rotation: pulley.attrs.data.rotation,
                          }, {
                            x: nextPulleyPosition.x,
                            y: nextPulleyPosition.y,
                            radius: nextPulley.getRadius(),
                            rotation: nextPulley.attrs.data.rotation,
                          })
                          nextLine.setAttr('points', [nextLineTangents.start.x, nextLineTangents.start.y, nextLineTangents.end.x, nextLineTangents.end.y,])

                          window.Konva.stages[0].children[0].draw()

                          return update(pulleys, {
                            [pulleyIndex]: {
                              y: {
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
                  <label htmlFor="inputRadius" className="col-sm-2 col-form-label">Radius:</label>
                  <div className="col-sm-10">
                    <input
                      type="number"
                      className="form-control"
                      id="inputRadius"
                      value={selectedPulley.radius}
                      onChange={e => {
                        const value = Number(e.target.value)
                        const stage = window.Konva.stages[0]
                        stage.findOne(`#${selectedPulleyId}`).setAttr('radius', value)

                        /**************/

                        const pulley = stage.findOne(`#${selectedPulleyId}`)
                        const pulleyPosition = pulley.getPosition()

                        const nextPulley = stage.findOne(`#${pulley.attrs.data.nextPulleyId}`)
                        const nextPulleyPosition = nextPulley.getPosition()

                        const prevPulley = stage.findOne(`#${pulley.attrs.data.prevPulleyId}`)
                        const prevPulleyPosition = prevPulley.getPosition()

                        const prevLine = stage.findOne(`#belt_${prevPulley.attrs.id}`)
                        const prevLineTangents = getTangents({
                          x: prevPulleyPosition.x,
                          y: prevPulleyPosition.y,
                          radius: prevPulley.getRadius(),
                          rotation: prevPulley.attrs.data.rotation,
                        }, {
                          x: pulleyPosition.x,
                          y: pulleyPosition.y,
                          radius: pulley.getRadius(),
                          rotation: pulley.attrs.data.rotation,
                        })
                        prevLine.setAttr('points', [prevLineTangents.start.x, prevLineTangents.start.y, prevLineTangents.end.x, prevLineTangents.end.y,])

                        const nextLine = stage.findOne(`#belt_${pulley.attrs.id}`)
                        const nextLineTangents = getTangents({
                          x: pulleyPosition.x,
                          y: pulleyPosition.y,
                          radius: pulley.getRadius(),
                          rotation: pulley.attrs.data.rotation,
                        }, {
                          x: nextPulleyPosition.x,
                          y: nextPulleyPosition.y,
                          radius: nextPulley.getRadius(),
                          rotation: nextPulley.attrs.data.rotation,
                        })
                        nextLine.setAttr('points', [nextLineTangents.start.x, nextLineTangents.start.y, nextLineTangents.end.x, nextLineTangents.end.y,])

                        stage.children[0].draw()

                        setPulleys(pulleys => {
                          const pulleyIndex = pulleys.findIndex(p => p.id === selectedPulleyId)

                          return update(pulleys, {
                            [pulleyIndex]: {
                              radius: {
                                $set: value,
                              },
                            },
                          })
                        })
                      }}
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
            {selectedPulley && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  const stage = window.Konva.stages[0]
                  stage.findOne(`#${selectedPulleyId}`).setAttr('fill', '#eee')
                  setSelectedPulleyId(null)
                  stage.children[0].draw()
                }}
              >Deselect</button>
            )}
          </div>

          <Designer
            selectedPulleyId={selectedPulleyId}
            setSelectedPulleyId={id => setSelectedPulleyId(id)}
            pulleys={pulleys}
            dropItem={dropItem}
            onPulleyDrop={(location, partIndex) => {
              /*setConveyor(conveyor => {
                const previousPart = partIndex === 0 ? conveyor.parts[conveyor.parts.length - 1] : conveyor.parts[partIndex - 1]
                const nextPart = partIndex === conveyor.parts.length - 1 ? conveyor.parts[0] : conveyor.parts[partIndex + 1]
                const newPulley = new Pulley(new Point(location.x, location.y))
                const firstNewBeltSection = new FreeBeltSection(previousPart, newPulley)
                const secondNewBeltSection = new FreeBeltSection(newPulley, nextPart)
                conveyor.parts.splice(partIndex, 1, firstNewBeltSection, newPulley, secondNewBeltSection)
                return _.cloneDeep(conveyor)
              })*/
            }}
            xonPulleyDrop={(dropPoint, pulleyIndex) => {
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
              const pulleyIndex = pulleys.findIndex(p => p.id === id)

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

          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">X</th>
                <th scope="col">Y</th>
                <th scope="col">Radius</th>
              </tr>
            </thead>
            <tbody>
              {pulleys.map(pulley => (
                <tr key={pulley.id} className={pulley.id === selectedPulleyId ? 'selectedPulley' : ''}>
                  <th scope="row">{pulley.id}</th>
                  <td>{pulley.x}</td>
                  <td>{pulley.y}</td>
                  <td>{pulley.radius}</td>
                </tr>
              ))}
            </tbody>
          </table>

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
