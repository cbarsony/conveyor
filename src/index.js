import React from 'react'
import ReactDOM from 'react-dom'
import 'bulma/css/bulma.css'
import './index.css'
import {App} from './App'
import * as model from './model'
import * as calculator from './calculator'

window.model = model
window.calculator = calculator

ReactDOM.render(
  <App/>,
  document.getElementById('root')
)
