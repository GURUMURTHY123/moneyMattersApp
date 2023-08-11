import React from 'react';
import {Component} from 'react'
import logo from '../../logo.svg'
import MenuItems from '../MenuItems'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import {TailSpin} from 'react-loader-spinner'
import './index.css'
import {AiFillHome} from 'react-icons/ai'
import { FaUserAlt } from "react-icons/fa";
import {FaMoneyBillTransfer} from 'react-icons/fa6'
import Popup from 'reactjs-popup'
import {FiLogOut} from 'react-icons/fi'

const linkData = [{
  id:1,
  text:"Dashboard",
  path:"/dashboard",
  icon:<AiFillHome />
},
{
  id:2,
  text:"Transaction",
  path:"/transaction",
  icon:<FaMoneyBillTransfer />
},
{
  id:3,
  text:"Profile",
  path:"/profile",
  icon:<FaUserAlt />
}]

class SideBar extends Component{
  state = {username:'', email:'', isLoading:true, popupClosed:false}
  parsedObject = JSON.parse(Cookies.get('userId'))

  logoutTheUser = async () => {
    await Cookies.remove('userId');
    await this.setState({popupClosed:true})
  }

  componentDidMount = async () =>{
    const url = "https://bursting-gelding-24.hasura.app/api/rest/profile"
    const options = {
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        Accept:'application/json',
        'x-hasura-admin-secret':'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
        'x-hasura-role':'user',
        'x-hasura-user-id': this.parsedObject.id
      }
    }
    const response = await fetch(url,options)
    if (response.ok===false){
      const {history} = this.props
      history.push({
        pathname:'/failure',
        state:{responseStatus:response.status,responseText:response.statusText}
      });
    }else{
    const profileData = await response.json()
    const {users} = profileData
    const objectProfile = users[0]
    this.setState({username:objectProfile.name, email:objectProfile.email, isLoading:false})
  }
  }

  render(){
    const {username, email, isLoading, popupClosed} = this.state
    const {activeLinkElement} = this.props
    return (
      <div className="sidebar-container">
        {popupClosed&& <Redirect to='/login' />}
        <div className="app-logo-container">
          <img src={logo} alt="app-logo" className='app-logo' />
          <p className="app-title">Money <span className="span-element">Matters</span></p>
        </div>
        <div className="menu-container">
          {
            linkData.map(eachItem=>(
              <MenuItems linkData={eachItem} key={eachItem.id} isActive={activeLinkElement===eachItem.text}  />
            ))
          }
        </div>
        <div className="footer-bg-container">
          {isLoading?<TailSpin height="20" width="20" color="#00BFFF" ariaLabel="tail-spin-loading" radius="1" wrapperStyle={{}} visible={true} /> : <div className="footer-container">
            <img src="data:image/jpeg;base64,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" alt="av" className="avatar" />
            <div className="footer-text-container" style={{marginLeft:'3px'}}>
              <span className="avatar-name">{username}</span>
              <span className="avatar-email">{email}</span>
            </div>
            <Popup trigger={<FiLogOut size="20px"/>} modal nested>
              {close => (
                <div className="logout-modal">
                  <div style={{borderRadius:'90px', backgroundColor:'#FEF3C7', padding:'8px', marginRight:'14px', marginTop:'10px'}}> 
                    <div style={{borderRadius:'90px', backgroundColor:'#FDE68A', padding:'5px', textAlign:'center'}}>
                      <FiLogOut color="#D97706" size="30px" style={{paddingTop:'3px'}} />
                    </div>
                  </div>
                  <div>
                    <h1 className='logout-popup-heading'>Are you sure you want to Logout?</h1>
                    <p className='logout-popup-description'>You will be logged out from the application. You can't undo this action. </p>
                    <button className='logout-popup-button' 
                    onClick={async event=>{
                      event.target.textContent = 'Loading...';
                      await this.logoutTheUser();
                      await close();
                    }}>Yes, Logout</button>
                    <button className='cancel-popup-button' onClick={()=>{close() }}>Cancel</button>
                  </div>
                  <button onClick={()=>{close()}} style={{border:'none', backgroundColor:'white', fontSize:'20px', color:"#718EBF"}}>X</button>
                </div>
              )}
            </Popup>
          </div>}
        </div>
      </div>
    )
  }
}

export default SideBar