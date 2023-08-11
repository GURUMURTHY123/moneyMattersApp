import React from 'react'
import {Component} from 'react'
import Header from '../Header'
import ProfileDetails from '../ProfileDetails'
import SideBar from '../SideBar'
import Cookies from 'js-cookie'
import {TailSpin} from 'react-loader-spinner'
import '../../style.css'

class Profile extends Component{
  
  state = {userDetails:{}, isLoading:true}
  parsedObject = JSON.parse(Cookies.get('userId'))

  addTransaction = () => {}

  getUserProfileDetails = async () => {
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
    const updatedProfileData = {
      id:objectProfile.id,
      name:objectProfile.name,
      email:objectProfile.email,
      country:objectProfile.country,
      dateOfBirth:objectProfile.date_of_birth,
      city:objectProfile.city,
      permanentAddress:objectProfile.permanent_address,
      postalCode:objectProfile.postal_code,
      presentAddress:objectProfile.present_address
    }
    this.setState({userDetails:updatedProfileData, isLoading:false})
  }
  }
  
  componentDidMount(){
    this.getUserProfileDetails()
  }

  render(){
    const {userDetails, isLoading} = this.state
    return (
    <>
      <SideBar activeLinkElement="Profile"  />
      <div className="route-container">
        <Header header="Profile" addTransaction={this.addTransaction} />
        {isLoading ? (
            <div className="load-container"><TailSpin height="50" width="50" color="#00BFFF" ariaLabel="tail-spin-loading" radius="1" wrapperStyle={{margin:20, padding:10}} wrapperClass="" visible={true} /></div>
          ) : (<ProfileDetails userDetails={userDetails} password={this.parsedObject.password} key={userDetails.id} />)}
      </div>
    </>
    )
  }
}

export default Profile