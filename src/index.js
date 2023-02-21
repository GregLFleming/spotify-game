import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil';
import App from './components/App'

const MOUNT_NODE = document.getElementById('app')


ReactDOM.render(
  <RecoilRoot>
    <Router>
      <App />
    </Router>
  </RecoilRoot>
  ,
  MOUNT_NODE
)
