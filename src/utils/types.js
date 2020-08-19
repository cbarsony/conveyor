import {getTangents} from '../utils/calculator'

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
   * @param id {string} - uuid
   * @param x {number}
   * @param y {number}
   * @param type {PULLEY_TYPE}
   * @param radius {number}
   * @param rotation {ROTATION}
   */
  constructor(id, x, y, type, radius = 20, rotation = ROTATION.CLOCKWISE) {
    this.id = id
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

  /** @param hopper {Hopper} */
  addHopper(hopper) {
    this.hoppers.push(hopper)
  }

  /** @param id {string} */
  removeHopper(id) {
    /* ... */
  }

  /** @returns {Hopper[]} */
  getHoppers() {

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
   * @param id {string} - uuid
   * @param type {HOPPER_TYPE}
   * @param distance {number} - distance from BeltSection start
   */
  constructor(id, type, distance) {
    this.id = id
    this.type = type
    this.distance = distance
  }
}
