import React from 'react'
import update from 'immutability-helper'
import Flatten from '@flatten-js/core'

import {Navbar} from './Navbar'
import {Sidebar} from './Sidebar'
import {Designer} from './Designer/Designer'
import {DataTable} from './DataTable'
import {CrossSection} from './CrossSection'
import {
  Pulley,
  DrivePulley,
  PULLEY_TYPE,
  HOPPER_TYPE,
} from '../utils/types'
import {getTangents, getDistanceOfSectionAndPoint} from '../utils/calculator'

export class App extends React.Component {
  state = {
    pulleys: [],
    dropItem: 'NONE',
    dropIndicator: null,
    selectedPulleyId: null,
    isGridVisible: true,
    cursor: {
      x: 0,
      y: 0,
    },
  }

  designerContainer = React.createRef()
  crossSectionContainer1 = React.createRef()
  crossSectionContainer2 = React.createRef()
  crossSectionContainer3 = React.createRef()

  render() {
    return (
      <React.Fragment>

        <Navbar
          isGridVisible={this.state.isGridVisible}
          onChangeGridVisible={isGridVisible => this.setState({isGridVisible})}
        />

        <div id="Content" className="container-fluid row">

          <Sidebar
            pulley={this.state.pulleys.find(p => p.id === this.state.selectedPulleyId)}
            onPulleyAttributeChange={this.onPulleyAttributeChange}
            onDeletePulley={this.onDeletePulley}
            onDeleteHopper={this.onDeleteHopper}
            onRotationChange={this.onRotationChange}
            onTypeChange={this.onTypeChange}
          />

          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">

            <button className="toggleButton btn btn-sm btn-outline-secondary" type="button" data-toggle="collapse" data-target="#CollapseDesigner">Horizontal Profile Design</button>

            <div className="collapse show" id="CollapseDesigner" ref={this.designerContainer}>

              {this.state.dropItem === 'NONE' ? (
                <div id="DropItemDropdown" className="dropdown">
                  <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="DropItemDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Drop Item</button>
                  <div className="dropdown-menu" aria-labelledby="DropItemDropdown">
                    <a className="dropdown-item" href="/#" data-dropitem="IDLER"     onClick={this.onToggleDropItem}>Idler</a>
                    <hr/>
                    <a className="dropdown-item" href="/#" data-dropitem="TAIL"      onClick={this.onToggleDropItem}>Tail Pulley</a>
                    <a className="dropdown-item" href="/#" data-dropitem="HEAD"      onClick={this.onToggleDropItem}>Head Pulley</a>
                    <a className="dropdown-item" href="/#" data-dropitem="BEND"      onClick={this.onToggleDropItem}>Bend Pulley</a>
                    <a className="dropdown-item" href="/#" data-dropitem="SNUB"      onClick={this.onToggleDropItem}>Snub Pulley</a>
                    <a className="dropdown-item" href="/#" data-dropitem="TAKEUP"    onClick={this.onToggleDropItem}>Takeup Pulley</a>
                    <a className="dropdown-item" href="/#" data-dropitem="DRIVE"     onClick={this.onToggleDropItem}>Drive Pulley</a>
                    <hr/>
                    <a className="dropdown-item" href="/#" data-dropitem="FEED"      onClick={this.onToggleDropItem}>Feed Point</a>
                    <a className="dropdown-item" href="/#" data-dropitem="DISCHARGE" onClick={this.onToggleDropItem}>Discharge Point</a>
                  </div>
                </div>

              ) : (
                <button id="DropItemDropdown" className="btn btn-sm btn-outline-secondary" data-dropitem="NONE" onClick={this.onToggleDropItem}>Cancel</button>
              )}

              <button
                id="FitAllButton"
                className="btn btn-sm btn-outline-secondary"
                onClick={this.onFitAllClick}
              >Fit all</button>

              {this.designerContainer.current && (
                <Designer
                  pulleys={this.state.pulleys}
                  selectedPulleyId={this.state.selectedPulleyId}
                  dropIndicator={this.state.dropIndicator}
                  dropItem={this.state.dropItem}
                  isGridVisible={this.state.isGridVisible}
                  width={this.designerContainer.current.offsetWidth}

                  onPulleyMove={this.onPulleyMove}
                  onPulleySelect={this.onPulleySelect}

                  onStageMouseMove={this.onStageMouseMove}
                  onStageMouseLeave={this.onStageMouseLeave}
                  onStageClick={this.onStageClick}
                />
              )}

            </div>

            <button className="toggleButton btn btn-sm btn-outline-secondary" type="button" data-toggle="collapse" data-target="#CollapseDataTable">Horizontal Profile Data</button>

            <div className="collapse show" id="CollapseDataTable">
              <DataTable
                pulleys={this.state.pulleys}
                selectedPulleyId={this.state.selectedPulleyId}
                onPulleyAttributeChange={this.onPulleyAttributeChange}
                onRotationChange={this.onRotationChange}
                onTypeChange={this.onTypeChange}
              />
            </div>

            <button className="toggleButton btn btn-sm btn-outline-secondary" type="button" data-toggle="collapse" data-target="#CollapseCrossSection">Cross Section Profile Data</button>

            <div id="CrossSections">
              
              <div ref={this.crossSectionContainer1} className="collapse show" id="CollapseCrossSection">
                {this.crossSectionContainer1.current && (
                  <CrossSection
                    id={1}
                    containerWidth={this.crossSectionContainer1.current.parentElement.clientWidth / 3}
                  />
                )}
              </div>
              
              <div ref={this.crossSectionContainer2} className="collapse show" id="CollapseCrossSection">
                {this.crossSectionContainer2.current && (
                  <CrossSection
                    id={2}
                    containerWidth={this.crossSectionContainer2.current.parentElement.clientWidth / 3}
                  />
                )}
              </div>
              
              <div ref={this.crossSectionContainer3} className="collapse show" id="CollapseCrossSection">
                {this.crossSectionContainer3.current && (
                  <CrossSection
                    id={3}
                    containerWidth={this.crossSectionContainer3.current.parentElement.clientWidth / 3}
                  />
                )}
              </div>
              
            </div>

          </main>

        </div>

        <footer>&copy; 2020 CONVtek. All Rights Reserved.</footer>

      </React.Fragment>
    )
  }

  //region Lifecycle

  componentDidMount() {
    const pulleys = [
      new Pulley(200, 300, PULLEY_TYPE.HEAD),
      new Pulley(1000, 300, PULLEY_TYPE.TAIL),
    ]

    this.setState({pulleys})
  }

  //endregion Lifecycle

  //region Callbacks

  onToggleDropItem = e => {
    const dropItem = e.target.dataset.dropitem

    this.setState({dropItem})
  }
  
  onPulleyMove = (id, x, y) => {
    const pulleyIndex = this.state.pulleys.findIndex(p => p.id === id)

    this.setState(state => update(state, {
      pulleys: {
        [pulleyIndex]: {
          x: {
            $set: x,
          },
          y: {
            $set: y,
          },
        },
      },
    }))
  }

  onPulleyAttributeChange = (key, value, pulleyId) => {
    const id = pulleyId || this.state.selectedPulleyId
    const pulleyIndex = this.state.pulleys.findIndex(p => p.id === id)

    this.setState(state => update(state, {
      pulleys: {
        [pulleyIndex]: {
          [key]: {
            $set: value,
          },
        },
      },
    }))
  }

  onPulleySelect = id => this.setState({selectedPulleyId: id === this.state.selectedPulleyId ? null : id})

  onDeletePulley = () => {
    if(this.state.pulleys.length <= 2) {
      alert(`Can't delete. Minimum object count is 2.`)
      return
    }

    const pulleyIndex = this.state.pulleys.findIndex(p => p.id === this.state.selectedPulleyId)

    this.setState(state => update(state, {
      pulleys: {
        $splice: [[pulleyIndex, 1]],
      },
    }))
  }

  onDeleteHopper = id => {
    const pulleyIndex = this.state.pulleys.findIndex(p => p.id === this.state.selectedPulleyId)
    const pulley = this.state.pulleys[pulleyIndex]
    const hopperIndex = pulley.hoppers.findIndex(h => h.id === id)

    this.setState(state => update(state, {
      pulleys: {
        [pulleyIndex]: {
          hoppers: {
            $splice: [[hopperIndex, 1]],
          },
        },
      },
    }))
  }

  onRotationChange = (rotation, pulleyId) => {
    const id = pulleyId || this.state.selectedPulleyId
    const pulleyIndex = this.state.pulleys.findIndex(p => p.id === id)

    this.setState(state => update(state, {
      pulleys: {
        [pulleyIndex]: {
          rotation: {
            $set: rotation,
          },
        },
      },
    }))
  }

  onTypeChange = (type, pulleyId) => {
    const id = pulleyId || this.state.selectedPulleyId
    const pulleyIndex = this.state.pulleys.findIndex(p => p.id === id)
    const oldPulley = this.state.pulleys[pulleyIndex]

    let newPulley

    switch(type) {
      case PULLEY_TYPE.IDLER:
        newPulley = new Pulley(oldPulley.x, oldPulley.y, type)
        break

      case PULLEY_TYPE.DRIVE:
        newPulley = new DrivePulley(oldPulley.x, oldPulley.y, 20, oldPulley.rotation)
        break

      default:
        newPulley = new Pulley(oldPulley.x, oldPulley.y, type, 20, oldPulley.rotation)
    }

    this.setState(state => update(state, {
      pulleys: {
        [pulleyIndex]: {
          $set: newPulley,
        },
      },
      selectedPulleyId: {
        $set: newPulley.id,
      },
    }))
  }

  onStageMouseMove = (x, y) => {
    const stage = window.Konva.stages.find(stage => stage.attrs.id === 'stageDesigner')
    
    const stageX = (x - stage.x()) / stage.scaleX()
    const stageY = (y - stage.y()) / stage.scaleY()

    if(this.state.dropItem === 'NONE') {
      this.setState({
        cursor: {
          x: Math.round(stageX),
          y: Math.round(stageY),
        },
      })
    }
    else {
      let smallestDistance = Number.MAX_SAFE_INTEGER
      let pulleyToDrop = null
      let nextPulleyToDrop = null

      this.state.pulleys.forEach((pulley, pulleyIndex) => {
        const nextPulley = this.state.pulleys[pulleyIndex === this.state.pulleys.length - 1 ? 0 : pulleyIndex + 1]

        const tempTangents = getTangents(pulley, nextPulley)
        const distance = getDistanceOfSectionAndPoint([
          {x: tempTangents.start.x, y: tempTangents.start.y},
          {x: tempTangents.end.x, y: tempTangents.end.y},
        ], {
          x: stageX,
          y: stageY,
        })

        if(distance < smallestDistance) {
          smallestDistance = distance
          pulleyToDrop = pulley
          nextPulleyToDrop = nextPulley
        }
      })

      const tangents = getTangents(pulleyToDrop, nextPulleyToDrop)

      const cursor = new Flatten.Point(stageX, stageY)
      const segment = new Flatten.Segment(
        new Flatten.Point(tangents.start.x, tangents.start.y),
        new Flatten.Point(tangents.end.x, tangents.end.y),
      )
      const distance = cursor.distanceTo(segment)

      this.setState({
        dropIndicator: {
          pulleyId: pulleyToDrop.id,
          x: distance[1].pe.x,
          y: distance[1].pe.y,
        },
        cursor: {
          x: stageX,
          y: stageY,
        }
      })
    }
  }

  onStageMouseLeave = () => this.setState({dropIndicator: null})

  onStageClick = () => {
    if(this.state.dropItem === 'NONE') {
      return
    }
    else if(this.state.dropItem === HOPPER_TYPE.FEED || this.state.dropItem === HOPPER_TYPE.DISCHARGE) {
      const pulleyIndex = this.state.pulleys.findIndex(p => p.id === this.state.dropIndicator.pulleyId)
      const nextPulleyIndex = pulleyIndex === this.state.pulleys.length - 1 ? 0 : pulleyIndex + 1
      const pulley = this.state.pulleys[pulleyIndex]
      const nextPulley = this.state.pulleys[nextPulleyIndex]

      pulley.addHopper(
        this.state.dropIndicator.x,
        this.state.dropIndicator.y,
        this.state.dropItem,
        nextPulley,
      )

      this.forceUpdate()
    }
    else {
      const prevPulleyIndex = this.state.pulleys.findIndex(p => p.id === this.state.dropIndicator.pulleyId)
      let newPulley

      if(this.state.dropItem === PULLEY_TYPE.DRIVE) {
        newPulley = new DrivePulley(this.state.dropIndicator.x, this.state.dropIndicator.y)
      }
      else {
        newPulley = new Pulley(this.state.dropIndicator.x, this.state.dropIndicator.y, PULLEY_TYPE[this.state.dropItem])
      }

      this.setState(state => update(state, {
        pulleys: {
          $splice: [[prevPulleyIndex + 1, 0, newPulley]],
        },
      }))
    }
  }
  
  onFitAllClick = () => {
    const stage = window.Konva.stages.find(stage => stage.attrs.id === 'stageDesigner')
    const bounds = {
      left: Number.MAX_SAFE_INTEGER,
      right: Number.MIN_SAFE_INTEGER,
      top: Number.MIN_SAFE_INTEGER,
      bottom: Number.MAX_SAFE_INTEGER,
    }
    const gap = 10
    const canvasWidth = this.designerContainer.current.parentElement.clientWidth
    const canvasRatio = canvasWidth / 600

    this.state.pulleys.forEach(pulley => {
      const pulleyBounds = {
        left: pulley.x - pulley.radius,
        right: pulley.x + pulley.radius,
        top: pulley.y + pulley.radius,
        bottom: pulley.y - pulley.radius,
      }
      
      pulleyBounds.left < bounds.left && (bounds.left = pulleyBounds.left - gap)
      pulleyBounds.right > bounds.right && (bounds.right = pulleyBounds.right + gap)
      pulleyBounds.top > bounds.top && (bounds.top = pulleyBounds.top + gap)
      pulleyBounds.bottom < bounds.bottom && (bounds.bottom = pulleyBounds.bottom - gap)
    })

    const boundScale = (bounds.right - bounds.left) / (bounds.top - bounds.bottom)

    //too narrow
    if(boundScale < canvasRatio) {
      const expectedWidth = (bounds.top - bounds.bottom) * canvasRatio
      const increase = (expectedWidth - (bounds.right - bounds.left)) / 2
      bounds.right += increase
      bounds.left -= increase
    }
    //too wide
    else if(boundScale > canvasRatio) {
      const expectedHeight = (bounds.right - bounds.left) / canvasRatio
      const increase = (expectedHeight - (bounds.top - bounds.bottom)) / 2
      bounds.top += increase
    }

    const scale = canvasWidth / (bounds.right - bounds.left)

    stage.scale({x: scale, y: scale * -1})

    const x = bounds.left * stage.scaleX() * -1
    const y = bounds.top * stage.scaleY() * -1

    stage.position({
      x,
      y,
    })

    stage.batchDraw()
    this.forceUpdate()
  }

  //endregion Callbacks
}
