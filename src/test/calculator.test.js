import {ROTATION} from '../utils/types'
import {
  getDistanceOfTwoPoints,
  getAngleOfTwoPoints,
  getTangents,
  getDistanceOfSectionAndPoint,
} from '../utils/calculator'

it('getDistanceOfTwoPoints', () => {
  [
    {
      p1: {x: 1, y: 1},
      p2: {x: 11, y: 1},
      result: 10,
    },
    {
      p1: {x: 1, y: 4},
      p2: {x: 5, y: 1},
      result: 5,
    },
    {
      p1: {x: 1, y: -2},
      p2: {x: 5, y: 1},
      result: 5,
    },
  ].forEach(d => expect(getDistanceOfTwoPoints(d.p1, d.p2)).toEqual(d.result))
})

it('getAngleOfTwoPoints', () => {
  [
    {
      p1: {x: 1, y: 1},
      p2: {x: 10, y: 10},
      result: Math.PI / 4,
    },
    {
      p1: {x: 1, y: 1},
      p2: {x: 1, y: 10},
      result: Math.PI / 2,
    },
    {
      p1: {x: 1, y: 1},
      p2: {x: -1000, y: 1},
      result: Math.PI,
    },
    {
      p1: {x: 1, y: 1},
      p2: {x: 2, y: 0},
      result: 7 * Math.PI / 4,
    },
  ].forEach(d => expect(getAngleOfTwoPoints(d.p1, d.p2)).toEqual(d.result))
})

it('getTangents', () => {
  const p1 = {
    x: 20,
    y: 20,
    radius: 20,
    rotation: ROTATION.CLOCKWISE,
  }
  const p2 = {
    x: 70,
    y: 100,
    radius: 30,
    rotation: ROTATION.ANTICLOCKWISE,
  }
  const tangents = getTangents(p1, p2)

  expect(tangents.start.x).toBeCloseTo(40)
  expect(tangents.start.y).toBeCloseTo(20)
  expect(tangents.end.x).toBeCloseTo(40)
  expect(tangents.end.y).toBeCloseTo(100)
})

it('getDistanceOfSectionAndPoint', () => {
  const s = [
    {x: 0, y: 0},
    {x: 10, y: 10},
  ]
  const p = {x: 10, y: 5}

  expect(getDistanceOfSectionAndPoint(s, p)).toBeCloseTo(5 / 1.4, 0.1)
})
