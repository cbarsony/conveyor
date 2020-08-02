import PropTypes from 'prop-types'

export const ROTATION = {
  CLOCKWISE: 'CLOCKWISE',
  ANTICLOCKWISE: 'ANTICLOCKWISE',
}

export const Pulley = {
  id: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  rotation: PropTypes.oneOf([ROTATION.CLOCKWISE, ROTATION.ANTICLOCKWISE]).isRequired,
}
