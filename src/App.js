import React from "react";
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import SideBar from './components/SideBar'
import Dashboard from './components/Dashboard'
import Profile from './components/Profile'
import Transaction from './components/Transaction'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import FailureView from './components/FailureView'
import './style.css'

const App = () => (
  <BrowserRouter>
    <Switch>
      <ProtectedRoute exact path="/" component={SideBar} />
      <ProtectedRoute exact path="/dashboard" component={Dashboard} />
      <ProtectedRoute exact path="/transaction" component={Transaction} />
      <ProtectedRoute exact path="/profile" component={Profile} />
      <Route exact path="/login" component={Login} />
      <Route exact path='/failure' component={FailureView} />
    </Switch>
  </BrowserRouter>
)

export default App


