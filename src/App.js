import React from 'react'
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import Home from './pages/Home'
import Map from './pages/Map'
import City from './pages/City'
import NoMatch from './pages/NoMatch'
import Rent from './pages/Rent'

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="app">
          {/* 路由配置 */}
          <Switch>
            <Redirect exact from="/" to="/home"></Redirect>
            <Route path="/home" component={Home}></Route>
            <Route path="/city" component={City}></Route>
            <Route path="/map" component={Map}></Route>
            <Route path="/rent" component={Rent}></Route>
            <Route component={NoMatch}></Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
