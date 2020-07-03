import {ROTATION_DIRECTION, BeltPoint} from './model'

export const getDistanceOfTwoPoints = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))

export const getAngleOfTwoPoints = (p1, p2) => {
  const partialResult = Math.atan2((p2.y - p1.y), (p2.x - p1.x))
  const result =  partialResult > 0 ? partialResult : Math.PI * 2 + partialResult
  return result % (Math.PI * 2)
}

export const getTangentOfPointAndCircle1 = (point, circle) => {
  const alpha = getAngleOfTwoPoints({x: circle.x, y: circle.y - 50}, point)

  return {
    x: circle.x - circle.radius * Math.sin(alpha) * -1,
    y: circle.y + circle.radius * Math.cos(alpha) * -1,
  }
}

export const getTangentOfPointAndCircle2 = (point, circle) => {
  const alpha = getAngleOfTwoPoints({x: circle.x, y: circle.y - 50}, point)

  return {
    x: circle.x - circle.radius * Math.sin(alpha),
    y: circle.y + circle.radius * Math.cos(alpha),
  }
}

export const getTangentsOfTwoCircles = (c1, c2) => {
  const alpha = getAngleOfTwoPoints(c1, c2)

  return {
    L1: {
      x: c1.x + c1.radius * Math.sin(alpha) * -1,
      y: c1.y + c1.radius * Math.cos(alpha),
    },
    R1: {
      x: c1.x + c1.radius * Math.sin(alpha),
      y: c1.y - c1.radius * Math.cos(alpha),
    },
    L2: {
      x: c2.x + c2.radius * Math.sin(alpha) * -1,
      y: c2.y + c2.radius * Math.cos(alpha),
    },
    R2: {
      x: c2.x - c2.radius * Math.sin(alpha) * -1,
      y: c2.y + c2.radius * Math.cos(alpha) * -1,
    },
  }
}

export const getTangents = (c1, c2) => {
  const d = getDistanceOfTwoPoints(c1.location, c2.location)
  const alpha = getAngleOfTwoPoints(c1.location, c2.location)
  const isOuterTangent = c1 instanceof BeltPoint || c2 instanceof BeltPoint || c1.rotationDirection === c2.rotationDirection
  let beta

  if(isOuterTangent) {
    const deltaR = c1.radius - c2.radius
    beta = Math.asin(deltaR / d)
  }
  else {
    const x = d / (c1.radius + c2.radius) * c1.radius
    beta = Math.acos(c1.radius / x)
  }

  const gamma1DirectionFactor = c1.rotationDirection === ROTATION_DIRECTION.CLOCKWISE ? -1 : 1
  const gamma2DirectionFactor = c2.rotationDirection === ROTATION_DIRECTION.CLOCKWISE ? -1 : 1

  const gamma1 = gamma1DirectionFactor * Math.PI / 2 + alpha + beta
  const gamma2 = gamma2DirectionFactor * Math.PI / 2 + alpha + beta

  const result = {
    start: {
      x: c1.location.x + Math.cos(gamma1) * c1.radius,
      y: c1.location.y + Math.sin(gamma1) * c1.radius,
    },
    end: {
      x: c2.location.x + Math.cos(gamma2) * c2.radius,
      y: c2.location.y + Math.sin(gamma2) * c2.radius,
    },
  }

  return result
}
