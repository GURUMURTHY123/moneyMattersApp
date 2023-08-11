import React from 'react'
import Cookies from 'js-cookie'
import {Route, Redirect} from 'react-router-dom'

const ProtectedRoute = props => {
  const token = Cookies.get('userId')
  if (token===undefined){
    return <Redirect to="/login" />
  }
  return <Route {...props} />
}

export default ProtectedRoute