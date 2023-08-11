import React from 'react'
import Popup from 'reactjs-popup'
import Cookies from 'js-cookie'
import {withRouter} from 'react-router-dom'
import '../../style.css'

const Header = props => {
  const {header, addTransaction} = props
  const parsedObject = JSON.parse(Cookies.get('userId'))
  
  const onClickAddTransaction = async () => {
    const newTransactionObject = {
      'user_id':parsedObject.id,
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
        'x-hasura-user-id':parsedObject.id
      },
      body:JSON.stringify(newTransactionObject)
    }
    const response = await fetch(url,options)
    if (response.ok===false){
      const {history} = props
      history.push({
        pathname:'/failure',
        state:{responseStatus:response.status,responseText:response.statusText}
      });
    }else{
    const responseData = await response.json()
    await addTransaction()
  }
  }
  return (
    <div className="header-container">
      <h1 className="header-title">{header}</h1>
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
              <label htmlFor="transaction-name" className='add-transaction-label-element'>Transaction Name</label>
              <input type="text" id="transaction-name" className='add-transaction-input-container' placeholder='Enter Name' />
            </div>
            <div className='add-transaction-user-container'> 
              <label className='add-transaction-label-element'>Transaction Type</label>
              <div style={{paddingRight:'20px',paddingLeft:'10px', border: '1px solid #DFEAF2', borderRadius: '15px'}}>
                <select className='add-transaction-select-container' id="add-transaction-select" style={{color:'#718EBF'}}>
                  <option>Select Transaction Type</option>
                  <option>Debit</option>
                  <option>Credit</option>
                </select>
              </div>
            </div>
            <div className='add-transaction-user-container'> 
              <label htmlFor="transaction-category" className='add-transaction-label-element'>Category</label>
              <input type="text" id="transaction-category" className='add-transaction-input-container' placeholder='Enter Category'  />
            </div>
            <div className='add-transaction-user-container'> 
              <label htmlFor="transaction-amount" className='add-transaction-label-element'>Amount</label>
              <input type="text" id="transaction-amount" className='add-transaction-input-container' placeholder='Enter Your Amount'  />
            </div>
            <div className='add-transaction-user-container'> 
              <label htmlFor="transaction-date" className='add-transaction-label-element'>Date</label>
              <input type="text" className='add-transaction-input-container' id="transaction-date" placeholder='Select Date'  onFocus={(event)=>(event.target.type="date")} onBlur={(event)=>(event.target.type='text')}  />
            </div>
            <button style={{marginTop:'5px',backgroundColor:'#2D60FF', border:'none', outline:'none', display:'flex', justifyContent:'center', padding:'12px', borderRadius:'10px', color:'white', fontSize:'14px'}} onClick={
              async event => {
                event.target.textContent = 'Loading...'
                await onClickAddTransaction();
                await close();
              }
            } >Add Transaction</button>
          </div>
        )}
      </Popup>
    </div>
  )
}

export default withRouter(Header);