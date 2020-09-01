import React from 'react'
import update from 'immutability-helper'
import {Stage, Layer, Rect} from 'react-konva'

import {Pulley} from './Pulley'
import {DropIndicator} from './DropIndicator'
import {BeltSection} from './BeltSection'
import {Hopper} from './Hopper'
import {Grid} from './Grid'
import {log} from '../../utils/log'

export class Designer extends React.Component {
  state = {
    selection: null,
  }

  render() {
    log('render Designer')

    const {
      pulleys,
      selectedPulleyId,
      dropItem,
      dropIndicator,
      isGridVisible,

      onPulleyMove,
      onPulleySelect,
      onStageMouseLeave,
      onStageClick,
    } = this.props
    
    return (
      <Stage
        id="stageDesigner"
        width={this.props.width}
        height={600}
        onMouseMove={this.onMouseMove}
        onMouseLeave={onStageMouseLeave}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onClick={onStageClick}
        onWheel={this.onWheel}
        onContextMenu={this.onContextMenu}
        draggable
        //For suppressing Konva draggable warning
        onDragEnd={() => {}}
        y={600}
        scaleY={-1}
      >
        <Layer>
          {this.stage && isGridVisible && (
            <Grid
              x={this.stage.x()}
              y={this.stage.y()}
              scale={this.stage.scaleX()}
              width={this.props.width}
            />
          )}
          {pulleys.map((pulley, pulleyIndex) => {
            const nextPulleyIndex = pulleyIndex === pulleys.length - 1 ? 0 : pulleyIndex + 1
            const nextPulley = pulleys[nextPulleyIndex]
            const beltSection = pulley.getBeltSection(nextPulley)

            return (
              <BeltSection
                key={beltSection.pulleyId}
                beltSection={beltSection}
                isSelected={beltSection.pulleyId === selectedPulleyId}
              />
            )
          })}
          {pulleys.map(pulley => (
            <Pulley
              key={pulley.id}
              pulley={pulley}
              isSelected={pulley.id === selectedPulleyId}
              onMove={onPulleyMove}
              onSelect={onPulleySelect}
            />
          ))}
          {pulleys.map((pulley, pulleyIndex) => {
            const nextPulleyIndex = pulleyIndex === pulleys.length - 1 ? 0 : pulleyIndex + 1
            const nextPulley = pulleys[nextPulleyIndex]
            const hoppers = pulley.getHoppers(nextPulley)

            return hoppers.map(hopper => (
              <Hopper
                key={hopper.id}
                x={hopper.x}
                y={hopper.y}
                onClick={() => onPulleySelect(pulley.id)}
              />
            ))
          })}
          {dropIndicator && (
            <DropIndicator
              x={dropIndicator.x}
              y={dropIndicator.y}
              type={dropItem}
            />
          )}
          {this.state.selection && (
            <Rect
              x={this.state.selection[0]}
              y={this.state.selection[1]}
              width={this.state.selection[2] - this.state.selection[0]}
              height={this.state.selection[3] - this.state.selection[1]}
              fill="#888"
              opacity={0.2}
            />
          )}
        </Layer>
      </Stage>
    )
  }

  //region Lifecycle

  componentDidMount() {
    this.stage = window.Konva.stages.find(stage => stage.attrs.id === 'stageDesigner')
    this.forceUpdate()
  }

/*
  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props, newProps)
  }
*/

  //endregion Lifecycle

  //region Callbacks

  onMouseMove = ({evt}) => {
    if(this.state.selection) {
      const stageX = (evt.layerX - this.stage.x()) / this.stage.scaleX()
      const stageY = (evt.layerY - this.stage.y()) / this.stage.scaleY()

      this.setState(state => update(state, {
        selection: {
          $splice: [[2, 2, stageX, stageY]],
        },
      }))
    }
    this.props.onStageMouseMove(evt.layerX, evt.layerY)
  }

  onWheel = ({evt}) => {
    evt.preventDefault()

    const oldScaleX = this.stage.scaleX()
    const oldScaleY = this.stage.scaleY()
    const scaleBy = 1.1
    const newScale = evt.deltaY < 0 ? oldScaleX * scaleBy : oldScaleX / scaleBy

    if(newScale < 0.01 || newScale > 100) {
      return
    }

    const pointer = this.stage.getPointerPosition()

    const mousePointTo = {
      x: (pointer.x - this.stage.x()) / oldScaleX,
      y: (pointer.y - this.stage.y()) / oldScaleY,
    }

    this.stage.scale({ x: newScale, y: -newScale })

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * -newScale,
    }
    this.stage.position(newPos)
    this.stage.batchDraw()
    this.forceUpdate()
  }

  onMouseDown = ({evt}) => {
    if(evt.button === 2) {
      const x = (evt.layerX - this.stage.x()) / this.stage.scaleX()
      const y = (evt.layerY - this.stage.y()) / this.stage.scaleY()

      this.setState({selection: [x, y, x, y,]})
    }
  }

  onMouseUp = ({evt}) => {
    if(evt.button === 2) {
      const selectionWidth = Math.abs(this.state.selection[2] - this.state.selection[0])
      const isSelectionReversed = () => this.state.selection[0] > this.state.selection[2]
      const canvasRatio = this.props.width / 600

      if(selectionWidth > 0) {
        let bounds

        if(isSelectionReversed()) {
          bounds = {
            left: this.state.selection[1],
            right: this.state.selection[3],
            top: this.state.selection[0],
            bottom: this.state.selection[2],
          }
        }
        else {
          bounds = {
            left: this.state.selection[0],
            right: this.state.selection[2],
            top: this.state.selection[1],
            bottom: this.state.selection[3],
          }
        }

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

        const scale = this.props.width / (bounds.right - bounds.left)

        this.stage.scale({x: scale, y: scale * -1})

        const x = bounds.left * this.stage.scaleX() * -1
        const y = bounds.top * this.stage.scaleY() * -1

        this.stage.position({
          x,
          y,
        })

        this.stage.batchDraw()
        this.forceUpdate()
      }

      this.setState({selection: null})
    }
  }

  onContextMenu = ({evt}) => {
    evt.preventDefault()
    return false
  }

  //endregion Callbacks
}
