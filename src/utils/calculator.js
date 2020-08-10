import {ROTATION} from './types'

export const getDistanceOfTwoPoints = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))

export const getAngleOfTwoPoints = (p1, p2) => {
  const partialResult = Math.atan2((p2.y - p1.y), (p2.x - p1.x))
  const result =  partialResult > 0 ? partialResult : Math.PI * 2 + partialResult
  return result % (Math.PI * 2)
}

export const getTangents = (c1, c2) => {
  const d = getDistanceOfTwoPoints(c1, c2)
  const alpha = getAngleOfTwoPoints(c1, c2)
  const isOuterTangent = c1.radius === 0 || c2.radius === 0 || c1.rotation === c2.rotation
  let result

  if(isOuterTangent) {
    //Radius change bug is caused here:
    const deltaR = c1.radius - c2.radius
    const gamma1DirectionFactor = c1.rotation === ROTATION.ANTICLOCKWISE ? -1 : 1
    const gamma2DirectionFactor = c2.rotation === ROTATION.ANTICLOCKWISE ? -1 : 1

    const beta = Math.asin(deltaR / d)

    const gamma1 = gamma1DirectionFactor * Math.PI / 2 + alpha + beta
    const gamma2 = gamma2DirectionFactor * Math.PI / 2 + alpha + beta

    result = {
      start: {
        x: c1.x + Math.cos(gamma1) * c1.radius,
        y: c1.y + Math.sin(gamma1) * c1.radius,
      },
      end: {
        x: c2.x + Math.cos(gamma2) * c2.radius,
        y: c2.y + Math.sin(gamma2) * c2.radius,
      },
    }
  }
  else {
    const alpha1 = alpha
    const alpha2 = getAngleOfTwoPoints(c2, c1)
    const x = d / (c1.radius + c2.radius) * c1.radius
    const gammaDirectionFactor = c1.rotation === ROTATION.ANTICLOCKWISE ? 1 : -1

    const beta = Math.acos(c1.radius / x)
    const gamma1 = alpha1 - (beta * gammaDirectionFactor)
    const gamma2 = alpha2 - (beta * gammaDirectionFactor)

    result = {
      start: {
        x: c1.x + Math.cos(gamma1) * c1.radius,
        y: c1.y + Math.sin(gamma1) * c1.radius,
      },
      end: {
        x: c2.x + Math.cos(gamma2) * c2.radius,
        y: c2.y + Math.sin(gamma2) * c2.radius,
      },
    }
  }

  return result
}

export const getDistanceOfSectionAndPoint = (s, p) => {
  const x = p.x
  const y = p.y
  const x1 = s[0].x
  const y1 = s[0].y
  const x2 = s[1].x
  const y2 = s[1].y
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let param = -1;
  if (len_sq !== 0) //in case of 0 length line
    param = dot / len_sq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  }
  else if (param > 1) {
    xx = x2;
    yy = y2;
  }
  else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}
