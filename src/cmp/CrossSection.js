import React from 'react'
import {Stage, Layer, Line} from 'react-konva'

export class CrossSection extends React.Component {
  state = {
    fullWidth: 600,
    bottomWidth: 300,
    angle: 45,
  }

  render() {
    const angleRadian = this.state.angle * Math.PI / 180
    const sideWidth = (this.state.fullWidth - this.state.bottomWidth) / 2

    const bottomLeftPoint = {
      x: this.state.bottomWidth / -2,
      y: 0,
    }

    const bottomRightPoint = {
      x: this.state.bottomWidth / 2,
      y: 0,
    }

    const topLeftPoint = {
      x: (this.state.bottomWidth / -2) - (sideWidth * Math.cos(angleRadian)),
      y: sideWidth * Math.sin(angleRadian),
    }

    const topRightPoint = {
      x: (this.state.bottomWidth / 2) + sideWidth * Math.cos(angleRadian),
      y: sideWidth * Math.sin(angleRadian),
    }

    return (
      <div>
        <form>

          <div className="form-group row">

            <label htmlFor={`inputFullWidth${this.props.id}`} className="col-sm-3 col-form-label col-form-label-sm">Full width (mm)</label>
            <div className="col-sm-3">
              <input
                type="number"
                className="form-control form-control-sm"
                id={`inputFullWidth${this.props.id}`}
                step={50}
                min={200}
                max={6000}
                value={this.state.fullWidth}
                onChange={this.onFullWidthChange}
              />
            </div>

            <label htmlFor={`inputBottomWidth${this.props.id}`} className="col-sm-3 col-form-label col-form-label-sm">Bottom width (mm)</label>
            <div className="col-sm-3">
              <input
                type="number"
                className="form-control form-control-sm"
                id={`inputBottomWidth${this.props.id}`}
                step={10}
                min={50}
                max={6000}
                value={this.state.bottomWidth}
                onChange={this.onBottomWidthChange}
              />
            </div>

            <label htmlFor={`inputAngle${this.props.id}`} className="col-sm-3 col-form-label col-form-label-sm">Angle (degrees)</label>
            <div className="col-sm-3">
              <input
                type="number"
                className="form-control form-control-sm"
                id={`inputAngle${this.props.id}`}
                step={1}
                min={0}
                max={90}
                value={this.state.angle}
                onChange={this.onAngleChange}
              />
            </div>

          </div>

        </form>
        <Stage
          id={`stageCrossSection${this.props.id}`}
          width={this.props.containerWidth}
          height={this.props.containerWidth}
        >
          <Layer>
            <Line
              points={[
                topLeftPoint.x,
                topLeftPoint.y,
                bottomLeftPoint.x,
                bottomLeftPoint.y,
                bottomRightPoint.x,
                bottomRightPoint.y,
                topRightPoint.x,
                topRightPoint.y,
              ]}
              stroke="#888"
              strokeWidth={10}
              lineCap="round"
              lineJoin="round"
              shadowForStrokeEnabled={false}
              strokeScaleEnabled={false}
            />
          </Layer>
        </Stage>
      </div>
    )
  }

  //region Lifecycle

  componentDidMount() {
    this.stage = window.Konva.stages.find(stage => stage.attrs.id === `stageCrossSection${this.props.id}`)
    this.scaleAndPositionStage()
  }

  componentDidUpdate() {
    this.scaleAndPositionStage()
  }

  //endregion Lifecycle

  //region Callbacks

  onFullWidthChange = e => {
    const fullWidth = Number(e.target.value)
    const isFullWidthSmallerThanBottomWidth = () => fullWidth < this.state.bottomWidth

    if(isFullWidthSmallerThanBottomWidth()) {
      //not allowed
      return
    }

    this.setState({fullWidth})
  }

  onBottomWidthChange = e => {
    const bottomWidth = Number(e.target.value)
    const isBottomWidthBiggerThanFullWidth = () => bottomWidth > this.state.fullWidth

    if(isBottomWidthBiggerThanFullWidth()) {
      //not allowed
      return
    }

    this.setState({bottomWidth})
  }

  onAngleChange = e => this.setState({angle: Number(e.target.value)})

  //endregion

  //region Private Methods

  scaleAndPositionStage() {
    const gap = 50
    const sideWidth = (this.state.fullWidth - this.state.bottomWidth) / 2
    const angleRadian = this.state.angle * Math.PI / 180
    const projectionWidth = this.state.bottomWidth + 2 * sideWidth * Math.cos(angleRadian)
    const scale = this.props.containerWidth / (projectionWidth + 2 * gap)

    this.stage.scale({
      x: scale,
      y: scale * -1,
    })
    this.stage.position({
      x: (projectionWidth / 2 + gap) * scale,
      y: this.props.containerWidth * 0.625,
    })
  }

  //endregion
}
