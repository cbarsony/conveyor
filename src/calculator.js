export const getDistanceOfTwoPoints = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))

export const getAngleOfTwoPoints = (p1, p2) => {
  const partialResult = Math.atan2((p2.y - p1.y), (p2.x - p1.x))
  return partialResult > 0 ? partialResult : Math.PI * 2 + partialResult
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
