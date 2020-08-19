import Flatten from '@flatten-js/core'

import {getTangents} from '../utils/calculator'

let pulleyIdCounter = 1
let hopperIdCounter = 1

/** @enum {ROTATION} */
export const ROTATION = {
  CLOCKWISE: 'CLOCKWISE',
  ANTICLOCKWISE: 'ANTICLOCKWISE',
}

/** @enum {PULLEY_TYPE} */
export const PULLEY_TYPE = {
  IDLER: 'IDLER',
  TAIL: 'TAIL',
  HEAD: 'HEAD',
  BEND: 'BEND',
  SNUB: 'SNUB',
  TAKEUP: 'TAKEUP',
  DRIVE: 'DRIVE',
}

/** @enum {HOPPER_TYPE} */
export const HOPPER_TYPE = {
  FEED: 'FEED',
  DISCHARGE: 'DISCHARGE',
}

/** @class */
export class Pulley {
  /**
   * @param x {number}
   * @param y {number}
   * @param type {PULLEY_TYPE}
   * @param radius {number}
   * @param rotation {ROTATION}
   */
  constructor(x, y, type, radius = 20, rotation = ROTATION.CLOCKWISE) {
    this.id = `p${pulleyIdCounter++}`
    this.x = x
    this.y = y
    this.type = type
    this.radius = type === PULLEY_TYPE.IDLER ? 0 : radius
    this.rotation = rotation
    this.hoppers = []
  }

  /**
   * @param nextPulley {Pulley}
   * @returns {BeltSection}
   */
  getBeltSection(nextPulley) {
    const tangents = getTangents(this, nextPulley)
    return new BeltSection(this.id, tangents.start, tangents.end)
  }

  addHopper(x, y, type, nextPulley) {
    const tangents = getTangents(this, nextPulley)
    const beltSectionStartPoint = new Flatten.Point(tangents.start.x, tangents.start.y)
    const beltSectionEndPoint = new Flatten.Point(tangents.end.x, tangents.end.y)
    const cursorPoint = new Flatten.Point(x, y)
    const hopperDistance = cursorPoint.distanceTo(beltSectionStartPoint)[0]
    const beltSectionLength = beltSectionStartPoint.distanceTo(beltSectionEndPoint)
    const distance = hopperDistance / beltSectionLength[0]

    this.hoppers.push(new Hopper(type, distance))
  }

  /** @param id {string} */
  removeHopper(id) {
    /* ... */
  }

  /**
   * @param nextPulley {Pulley}
   * @returns {Hopper[]}
   */
  getHoppers(nextPulley) {
    return this.hoppers.map(hopper => {
      const beltSection = this.getBeltSection(nextPulley)
      const segment = new Flatten.Segment(
        new Flatten.Point(beltSection.start.x, beltSection.start.y),
        new Flatten.Point(beltSection.end.x, beltSection.end.y),
      )
      const circle = new Flatten.Circle(new Flatten.Point(beltSection.start.x, beltSection.start.y), hopper.distance * segment.length)
      const intersection = segment.intersect(circle)

      return {
        x: intersection[0] ? intersection[0].x : beltSection.end.x,
        y: intersection[0] ? intersection[0].y : beltSection.end.y,
        id: hopper.id,
        type: hopper.type,
      }
    })
  }
}

/** @class */
export class BeltSection {
  /**
   * @param pulleyId {string}
   * @param start {object} - {x:n, y:n}
   * @param end {object} - {x:n, y:n}
   */
  constructor(pulleyId, start, end) {
    this.pulleyId = pulleyId
    this.start = start
    this.end = end
  }
}

/** @class */
export class Hopper {
  /**
   * @param type {HOPPER_TYPE}
   * @param distance {number} - distance from BeltSection start
   */
  constructor(type, distance) {
    this.id = `h${hopperIdCounter++}`
    this.type = type
    this.distance = distance
  }
}
