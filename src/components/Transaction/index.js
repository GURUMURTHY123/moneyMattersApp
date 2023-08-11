import React from 'react'
import {Component} from 'react'
import TransactionHeader from '../TransactionHeader'
import TransactionItems from '../TransactionItems'
import SideBar from '../SideBar'
import Cookies from 'js-cookie'
import {TailSpin} from 'react-loader-spinner'
import Popup from 'reactjs-popup'
import '../../style.css'

const linkList = [{id:"",text:"All Transactions"},{id:"debit", text:"Debit"},{id:"credit", text:"Credit"}]

class Transaction extends Component{
 
  state = {activeLink:"", transactionDetailsList:[], isDataEmpty:false, isLoading:true}
  parsedObject = JSON.parse(Cookies.get('userId'))

  editTransaction = async editObject => {
    const url= 'https://bursting-gelding-24.hasura.app/api/rest/update-transaction'
      const options = {
        method:'POST',
        headers:{
          "Content-Type":'application/json',
          Accept:'application/json',
          'x-hasura-admin-secret':'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
          'x-hasura-role':'user',
          'x-hasura-user-id': this.parsedObject.id
        },
        body:JSON.stringify(editObject)
      }
      const response = await fetch(url,options)
      if (response.ok===false){
        const {history} = this.props
        history.push({
          pathname:'/failure',
          state:{responseStatus:response.status,responseText:response.statusText}
        });
      }else{
      await this.getTransactionDetails(this.state.activeLink)}
  }

  deleteTransaction = async id => {
    const url='https://bursting-gelding-24.hasura.app/api/rest/delete-transaction'
    const options={
      method:'DELETE',
      headers:{
        "Content-Type":'application/json',
        Accept:'application/json',
        'x-hasura-admin-secret':'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
        'x-hasura-role':'user',
        'x-hasura-user-id': this.parsedObject.id
      },
      body:JSON.stringify({
        'id':id
      })
    }
    const response = await fetch(url,options)
    if (response.ok===false){
      const {history} = this.props
      history.push({
        pathname:'/failure',
        state:{responseStatus:response.status,responseText:response.statusText}
      });
    }else{
    const responseData = await response.json()
    await this.getTransactionDetails(this.state.activeLink)}
  }

  dateObject = dateString => {
    let date = new Date(dateString)
    let month = (date.toLocaleDateString('default', {month:'short'}))
    return (`${month} ${date.getDate()}, ${date.getFullYear()}`)
  }

  onClickAddTransaction = async () => {
    const newTransactionObject = {
      'user_id':this.parsedObject.id,
      'name':document.getElementById('transaction-name').value,
      'type':document.getElementById('add-transaction-select').value.toLowerCase(),
      'category':document.getElementById('transaction-category').value,
      'amount':document.getElementById('transaction-amount').value,
      'date':document.getElementById('transaction-date').value
    }
    const url="https://bursting-gelding-24.hasura.app/api/rest/add-transaction"
    const options = {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        Accept:'application/json',
        'x-hasura-admin-secret':'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
        'x-hasura-role':'user',
        'x-hasura-user-id':this.parsedObject.id
      },
      body:JSON.stringify(newTransactionObject)
    }
    const response = await fetch(url,options)
    if (response.ok===false){
      const {history} = this.props
      history.push({
        pathname:'/failure',
        state:{responseStatus:response.status,responseText:response.statusText}
      });
    }else{
    await this.getTransactionDetails(this.state.activeLink)}
  }


  getTransactionDetails = async id => {
    const {activeLink} = this.state
    const url = "https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=80&&offset=0"
    const options = {
      method:'GET',
    headers:{
      "Content-Type":'application/json',
      Accept:'application/json',
      'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
      'x-hasura-role':'user',
      'x-hasura-user-id': this.parsedObject.id
    },
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
    const updatedData= responseData.transactions.map(eachData=>{
      if (eachData.type.includes(id)){
          return (
          {
            amount:eachData.amount,
            category:eachData.category,
            date:this.dateObject(eachData.date),
            id:eachData.id,
            transactionName:eachData.transaction_name,
            transactionType:eachData.type,
            userId:eachData.user_id
          }
        )
        }
      })
    const filteredData = updatedData.filter(eachData=>{
      if (eachData!=='undefined'){
        return eachData
      }
    })
    if (filteredData.length===0){
      this.setState({isDataEmpty:true, isLoading:false})
    }else{
      this.setState({transactionDetailsList:(filteredData.sort((a,b)=>{
        return new Date(a.date)- new Date(b.date)
      })), isDataEmpty:false, isLoading:false})
    }
  }
  }

  getActiveLink = async id => {
  await this.setState({isLoading:true})
  await this.setState({activeLink:id})
  await this.getTransactionDetails(id)
  }

  componentDidMount(){
    const {activeLink} = this.state
    this.getTransactionDetails(activeLink)
  }

  render(){
    const {activeLink, transactionDetailsList, isDataEmpty, isLoading} = this.state
    return (
      <>
        <SideBar activeLinkElement="Transaction" />
        <div className="route-container">
          <div className="transaction-header-container">
            <div className="transaction-header">
              <span className="header-title">Transactions</span>
              <ul className="transaction-links-container">
              {
                linkList.map(eachData=>(<TransactionHeader linkData={eachData} key={eachData.id} getActiveLink={this.getActiveLink} isActive={activeLink===eachData.id} />))
              }
              </ul>
            </div>
            <Popup trigger={<button className="add-button">+ Add Transactions</button>} modal nested>
              {close => (
                <div style={{paddingTop:'12px', padding:'15px', display:'flex', flexDirection:'column'}}>
                  <div className='add-transaction-header-container'>
                    <div> 
                      <h1 className='add-transaction-heading'>Add Transaction</h1>
                      <p className='add-transaction-description'>You can add your transaction here</p>
                    </div>
                    <button onClick={()=>close()} className='add-transaction-remove-button' style={{border:'none', backgroundColor:'white', fontSize:'23px', color:"#718EBF"}}>X</button>
                  </div>
                  <div className='add-transaction-user-container'> 
                    <label for="transaction-name" className='add-transaction-label-element'>Transaction Name</label>
                    <input type="text" id="transaction-name" className='add-transaction-input-container' placeholder='Enter Name' />
                  </div>
                  <div className='add-transaction-user-container'> 
                    <label className='add-transaction-label-element'>Transaction Type</label>
                    <div style={{paddingRight:'20px',paddingLeft:'10px', border: '1px solid #DFEAF2', borderRadius: '15px'}}>
                      <select className='add-transaction-select-container' id="add-transaction-select" style={{color:'#718EBF'}}>
                        <option selected>Select Transaction Type</option>
                        <option>Debit</option>
                        <option>Credit</option>
                      </select>
                    </div>
                  </div>
                  <div className='add-transaction-user-container'> 
                    <label for="transaction-category" className='add-transaction-label-element'>Category</label>
                    <input type="text" id="transaction-category" className='add-transaction-input-container' placeholder='Enter Category'  />
                  </div>
                  <div className='add-transaction-user-container'> 
                    <label for="transaction-amount" className='add-transaction-label-element'>Amount</label>
                    <input type="text" id="transaction-amount" className='add-transaction-input-container' placeholder='Enter Your Amount'  />
                  </div>
                  <div className='add-transaction-user-container'> 
                    <label for="transaction-date" className='add-transaction-label-element'>Date</label>
                    <input type="text" className='add-transaction-input-container' id="transaction-date" placeholder='Select Date'  onFocus={(event)=>(event.target.type="date")} onBlur={(event)=>(event.target.type='text')}  />
                  </div>
                  <button style={{marginTop:'5px',backgroundColor:'#2D60FF', border:'none', outline:'none', display:'flex', justifyContent:'center', padding:'12px', borderRadius:'10px', color:'white', fontSize:'14px'}} onClick={
                    async event => {
                      event.target.textContent = 'Loading...'
                      await this.onClickAddTransaction();
                      await close();
                    }
                  }>Add Transaction</button>
                </div>
              )}
            </Popup>
          </div>
          {isLoading ? (
            <div className="load-container"><TailSpin height="50" width="50" color="#00BFFF" ariaLabel="tail-spin-loading" radius="1" wrapperStyle={{margin:20, padding:10}} wrapperClass="" visible={true} /></div>
          ) : (<div className="transaction-details-container">
            {!isDataEmpty&&<ul className="transaction-list-container" style={{margin:30}}>
                <div className='table-header'>
                  <th className="table-header-element1">Transaction Name</th>
                  <th className="table-header-element2">Category</th>
                  <th className="table-header-element3">Date</th>
                  <th>Amount</th>
                </div>
                {transactionDetailsList.map(eachItem=>(
                      <TransactionItems details={eachItem} key={eachItem.id} isSeparator={true} editTransaction={this.editTransaction} deleteTransaction={this.deleteTransaction} />
                    ))}
              </ul>}
              {isDataEmpty&&<h1 className="error-transactions">Transaction's are Empty</h1>}
          </div>)}
        </div>
      </>
    )
    }
}

export default Transaction

 