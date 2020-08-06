/** @enum {ROTATION} */
export const ROTATION = {
  CLOCKWISE: 'CLOCKWISE',
  ANTICLOCKWISE: 'ANTICLOCKWISE',
}

/** @enum {PULLEY_TYPE} */
export const PULLEY_TYPE = {
  POINT_ON_CONVEYOR: 'POINT_ON_CONVEYOR',
  PULLEY: 'PULLEY',
  DRIVE_PULLEY: 'DRIVE_PULLEY',
}

/** @class */
export class PointOnConveyor {
  /**
   * @param id {string}
   * @param x {number}
   * @param y {number}
   */
  constructor(id, x, y) {
    this.id = id
    this.x = x
    this.y = y
    this.radius = 1
    this.rotation = ROTATION.CLOCKWISE
    this.type = PULLEY_TYPE.POINT_ON_CONVEYOR
  }
}

/** @class */
export class Pulley extends PointOnConveyor{
  /**
   * @param id {string}
   * @param x {number}
   * @param y {number}
   * @param radius {number}
   * @param rotation {ROTATION}
   */
  constructor(id, x, y, radius = 20, rotation = ROTATION.CLOCKWISE) {
    super(id, x, y)

    this.radius = radius
    this.rotation = rotation
    this.type = PULLEY_TYPE.PULLEY
  }
}

/** @class */
export class DrivePulley extends Pulley {
  /**
   * @param id {string}
   * @param x {number}
   * @param y {number}
   * @param radius {number}
   * @param rotation {ROTATION}
   * @param driveCount {number}
   */
  constructor(id, x, y, radius = 20, rotation = ROTATION.CLOCKWISE, driveCount = 1) {
    super(id, x, y, radius, rotation)

    this.driveCount = driveCount
    this.type = PULLEY_TYPE.DRIVE_PULLEY
  }
}
