import React from 'react'
import ReactDOM from 'react-dom'
import 'bulma/css/bulma.css'
import './index.css'
import {App} from './App'
import * as model from './model'

window.model = model

ReactDOM.render(
  <App/>,
  document.getElementById('root')
)
