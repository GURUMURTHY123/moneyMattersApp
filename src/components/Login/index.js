import React from 'react'
import {Component} from 'react'
import logo from '../../logo.svg'
import Cookies from 'js-cookie'
import {TailSpin} from 'react-loader-spinner'
import FailureView from '../FailureView'
import './index.css'

class Login extends Component{

  state={email:'', password:'', isInValid:false, isLoading:false}

  onSubmitSuccess(){
    const {history} = this.props
    history.push('/dashboard')
  }

  submitForm = async event => {
    event.preventDefault()
    await this.setState({isLoading:true})
    const {email, password} = this.state
    const userDetails = {email, password}
    const url="https://bursting-gelding-24.hasura.app/api/rest/get-user-id"
    const options = {
      method:'POST',
      headers:{
        "Content-Type":'application/json',
        Accept:'application/json',
        'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF'
      },
      body: JSON.stringify(userDetails)
    }
    const response = await fetch(url, options)
    if (response.ok===false){
      const {history} = this.props
      history.push({
        pathname:'/failure',
        state:{responseStatus:response.status,responseText:response.statusText}
      });
    }else{
    const responseData = await response.json()
    const {get_user_id} = responseData
    if (get_user_id.length === 1){
      const {id} = get_user_id[0]
      const userInformation = JSON.stringify({email:email, password:password, id:id})
      Cookies.set('userId', userInformation, {expires:30});
      this.onSubmitSuccess()
    }else{
      this.setState({email:'', password:'', isInValid:true, isLoading:false})
    }}
  }

  onChangeEmail = event => {
    this.setState({email:event.target.value})
  }

  onChangeUserPassword = event => {
    this.setState({password:event.target.value})
  }

  renderUserPasswordField = () => {
    const {password} = this.state
    return(
      <>
        <label className="login-label-element" htmlFor="userpassword">PASSWORD</label>
        <input type="password" id="userpassword" className="login-input-element" placeholder='Admin@123' value={password} onChange={this.onChangeUserPassword} />
      </>
    )
  }

  renderUserEmailField = () => {
    const {email} = this.state
    return (
      <>
        <label className="login-label-element" htmlFor="username">E-MAIL</label>
        <input type="text" id="username" className="login-input-element" value={email} placeholder='admin@gmail.com' onChange={this.onChangeEmail} />
      </>
    )
  }

  render(){
    const {isInValid, isLoading} = this.state
    return(
      <div className="login-container">
        <form className="login-form-container" onSubmit={this.submitForm}>
          <div className="login-image-container">
            <img src={logo} alt="logo" className="login-logo-image" />
            <p className="login-image-text">Money <span style={{color:'#02969C'}}>Matters</span></p>
          </div>
          <div className="user-input-container">{this.renderUserEmailField()}</div>
          <div className="user-input-container">{this.renderUserPasswordField()}</div>
          <div className="button-container"><button type="submit" className="form-submit-button">
            {isLoading ? <TailSpin height="20" width="40" color="#ffffff" ariaLabel="tail-spin-loading" radius="1" wrapperStyle={{padding:5}} visible={true} /> : "Login" }
          </button></div>
          {isInValid && <p style={{color:'red'}}>* Invalid username or password</p>}
        </form>
      </div>
    )
  }
}

export default Login