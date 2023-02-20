import React from 'react'
import { Route } from 'react-router-dom'
import Game from '../views/Game.js'

import Home from '../views/Home'

const App = () => (
  <div>
    <Route exact path='/' component={Home} />
    <Route path='/game' component={Game} />
  </div>
)

export default App
