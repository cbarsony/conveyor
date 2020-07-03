import React from 'react'
import {Shape, Line, Circle} from 'react-konva'

import {uuid} from './uuid'
import {getTangents} from './calculator'

/**
 * @enum
 */
export const ROTATION_DIRECTION = {
  CLOCKWISE: 'CLOCKWISE',
  ANTICLOCKWISE: 'ANTICLOCKWISE',
}

export class Point {
  /**
   * @param x {number} - horizontal distance from center in meters
   * @param y {number} - vertical distance from center in meters
   * @param [z=0] {number} - distance from center on the Z-axis in meters
   */
  constructor(x, y, z = 0) {
    this.x = x
    this.y = y
    this.z = z
  }
}

export class ConveyorPart {
  constructor(location) {
    this.location = location
  }
}

export class BeltPoint extends ConveyorPart {
  /**
   * @param location {Point}
   */
  constructor(location) {
    super(location)

    this.radius = 0
  }

  draw() {
    return (
      <Shape
        key={uuid()}
        sceneFunc={(context, shape) => {
          context.beginPath()
          context.moveTo(this.location.x, this.location.y - 10)
          context.lineTo(this.location.x, this.location.y + 10)
          context.moveTo(this.location.x - 10, this.location.y)
          context.lineTo(this.location.x + 10, this.location.y)
          context.fillStrokeShape(shape);
        }}
        stroke="#f66"
        strokeWidth={1}
      />
    )
  }
}

export class Pulley extends ConveyorPart {
  /**
   * @param location {Point}
   * @param radius {number|undefined} - meter
   * @param rotationDirection {ROTATION_DIRECTION}
   */
  constructor(location, radius = 20, rotationDirection = ROTATION_DIRECTION.CLOCKWISE) {
    super(location)

    this.radius = radius
    this.rotationDirection = rotationDirection
  }

  draw() {
    const x = this.location.x
    const y = this.location.y

    return (
      <React.Fragment
        key={uuid()}
      >
        <Circle
          x={x}
          y={y}
          radius={this.radius}
          stroke="#888"
          fill="#eee"
          shadowBlur={6}
          shadowOpacity={0.3}
        />
        <Shape
          sceneFunc={(context, shape) => {
            context.beginPath()
            context.moveTo(x, y - 10)
            context.lineTo(x, y + 10)
            context.moveTo(x - 10, y)
            context.lineTo(x + 10, y)
            context.fillStrokeShape(shape);
          }}
          stroke="#f66"
          strokeWidth={1}
        />
      </React.Fragment>
    )
  }
}

export class FreeBeltSection extends ConveyorPart {
  /**
   * @param startConveyorPart {ConveyorPart}
   * @param endConveyorPart {ConveyorPart}
   */
  constructor(startConveyorPart, endConveyorPart) {
    //temporary
    const location = startConveyorPart.location
    super(location)

    this.startConveyorPart = startConveyorPart
    this.endConveyorPart = endConveyorPart
  }

  draw() {
    const tangents = getTangents(this.startConveyorPart, this.endConveyorPart)

    return (
      <React.Fragment
        key={uuid()}
      >
        <Line
          points={[
            tangents.start.x,
            tangents.start.y,
            tangents.end.x,
            tangents.end.y,
          ]}
          stroke="#888"
        />
        <Circle
          x={tangents.end.x}
          y={tangents.end.y}
          radius={3}
          stroke={'red'}
        />
      </React.Fragment>
    )
  }
}

export class ArcBeltSection extends ConveyorPart {
  /**
   * @param pulley {Pulley} - Pulley the BeltSection is contacting
   * @param nextConveyorPart {ConveyorPart}
   * @param previousConveyorPart {ConveyorPart}
   */
  constructor(pulley, nextConveyorPart, previousConveyorPart) {
    //temporary
    let location = pulley.location

    /*if(previousConveyorPart instanceof Pulley) {

    }
    else if(previousConveyorPart instanceof BeltPoint) {

    }*/

    super(location)

    this.pulley = pulley
    this.nextConveyorPart = nextConveyorPart
    this.previousConveyorPart = previousConveyorPart
  }

  /** @returns {Point} */
  getEndPoint() {
    //temporary
    return this.location
  }

  /** @returns {ROTATION_DIRECTION} */
  getRotationDirection() {}
}

export class Conveyor {
  /*constructor() {
    const p1 = new Pulley(new Point(20, 20))
  }*/
  constructor() {
    const p1 = new Pulley(new Point(100, 100))
    const p2 = new Pulley(new Point(200, 100), 50)
    const p3 = new Pulley(new Point(200, 300), 50, ROTATION_DIRECTION.ANTICLOCKWISE)
    const p4 = new Pulley(new Point(600, 300), 200)
    const p5 = new BeltPoint(new Point(100, 500))
    const p6 = new Pulley(new Point(100, 280), undefined, ROTATION_DIRECTION.ANTICLOCKWISE)

    const b1 = new FreeBeltSection(p1, p2)
    const b2 = new FreeBeltSection(p2, p3)
    const b3 = new FreeBeltSection(p3, p4)
    const b4 = new FreeBeltSection(p4, p5)
    const b5 = new FreeBeltSection(p5, p6)
    const b6 = new FreeBeltSection(p6, p1)

    this.parts = [
      p1,
      p2,
      p3,
      p4,
      p5,
      p6,

      b1,
      b2,
      b3,
      b4,
      b5,
      b6,
    ]
  }

  /**
   * @param index {number} - Index of FreeBeltSection in this.parts
   * @param conveyorPart
   */
  addConveyorPart(index, conveyorPart) {
    const beltSection = this.parts[index]

    if(!beltSection instanceof FreeBeltSection) {
      throw new Error('Only instance of FreeBeltSection can be the base of new ConveyorPart')
    }

    debugger
  }
}

export const conveyor = new Conveyor()
