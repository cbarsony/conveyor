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
   * @param radius {number} - meter
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
  constructor() {
    const p1 = new Pulley(new Point(100, 100))
    const p2 = new Pulley(new Point(200, 100), 50)
    const p3 = new Pulley(new Point(200, 300), 50, ROTATION_DIRECTION.ANTICLOCKWISE)
    const p4 = new Pulley(new Point(600, 300), 200)
    const p5 = new BeltPoint(new Point(100, 500))

    const b1 = new FreeBeltSection(p1, p2)
    const b2 = new FreeBeltSection(p2, p3)
    const b3 = new FreeBeltSection(p3, p4)
    const b4 = new FreeBeltSection(p4, p5)
    const b5 = new FreeBeltSection(p5, p1)

    this.parts = [
      p1,
      p2,
      p3,
      p4,
      p5,
      b1,
      b2,
      b3,
      b4,
      b5,
    ]
  }

/*
  constructor() {
    const pulley1 = new Pulley(new Point(100, 100), 100)
    const pulley2 = new Pulley(new Point(250, 100))
    const belt1_2 = new FreeBeltSection(pulley1, pulley2)
    const belt2_1 = new FreeBeltSection(pulley2, pulley1)

    const pulley3 = new Pulley(new Point(400, 100), 100)
    const pulley4 = new Pulley(new Point(400, 300))
    const belt3_4 = new FreeBeltSection(pulley3, pulley4)
    const belt4_3 = new FreeBeltSection(pulley4, pulley3)

    const pulley5 = new Pulley(new Point(700, 100))
    const pulley6 = new Pulley(new Point(650, 300), 150)
    const belt5_6 = new FreeBeltSection(pulley5, pulley6)
    const belt6_5 = new FreeBeltSection(pulley6, pulley5)

    const pulley7 = new Pulley(new Point(1000, 100), 100, ROTATION_DIRECTION.ANTICLOCKWISE)
    const pulley8 = new Pulley(new Point(900, 300), 50)
    const belt7_8 = new FreeBeltSection(pulley7, pulley8)
    const belt8_7 = new FreeBeltSection(pulley8, pulley7)

    const pulley9 = new Pulley(new Point(210, 600), 180)
    const pulley10 = new Pulley(new Point(500, 600))
    const belt9_10 = new FreeBeltSection(pulley9, pulley10)
    const belt10_9 = new FreeBeltSection(pulley10, pulley9)

    const pulley11 = new Pulley(new Point(700, 600), 50)
    const pulley12 = new Pulley(new Point(900, 600), 50)
    const belt11_12 = new FreeBeltSection(pulley11, pulley12)
    const belt12_11 = new FreeBeltSection(pulley12, pulley11)

    const pulley13 = new Pulley(new Point(700, 720), 50, ROTATION_DIRECTION.ANTICLOCKWISE)
    const pulley14 = new Pulley(new Point(900, 720), 50, ROTATION_DIRECTION.ANTICLOCKWISE)
    const belt13_14 = new FreeBeltSection(pulley13, pulley14)
    const belt14_13 = new FreeBeltSection(pulley14, pulley13)

    const pulley15 = new Pulley(new Point(1050, 600), 50)
    const pulley16 = new Pulley(new Point(1050, 720), 50)
    const belt15_16 = new FreeBeltSection(pulley15, pulley16)
    const belt16_15 = new FreeBeltSection(pulley16, pulley15)

    // const firstPulley = new Pulley(new Point(300, 100), 100)
    // const secondPulley = new Pulley(new Point(500, 300), 40)
    // const beltPoint1 = new BeltPoint(new Point(100, 100))
    // const beltPoint2 = new BeltPoint(new Point(300, 200))
    // const beltSection1 = new FreeBeltSection(beltPoint1, beltPoint2)
    // const upperFreeBeltSection = new FreeBeltSection(firstPulley, secondPulley)
    // const firstArcBeltSection = new ArcBeltSection(firstPulley, secondPulley, beltPoint)
    // const secondArcBeltSection = new ArcBeltSection(secondPulley, beltPoint, firstPulley)
    // const bottomFreeBeltSection1 = new FreeBeltSection(secondPulley, firstPulley)
    // const bottomFreeBeltSection2 = new FreeBeltSection(beltPoint, firstPulley)

    /!** @type {ConveyorPart[]} *!/
    this.parts = [
      pulley1,
      pulley2,
      belt1_2,
      belt2_1,

      pulley3,
      pulley4,
      belt3_4,
      belt4_3,

      pulley5,
      pulley6,
      belt5_6,
      belt6_5,

      pulley7,
      pulley8,
      belt7_8,
      belt8_7,

      pulley9,
      pulley10,
      belt9_10,
      belt10_9,

      pulley11,
      pulley12,
      belt11_12,
      belt12_11,

      pulley13,
      pulley14,
      belt13_14,
      belt14_13,

      pulley15,
      pulley16,
      belt15_16,
      belt16_15,
    ]
  }
*/

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
