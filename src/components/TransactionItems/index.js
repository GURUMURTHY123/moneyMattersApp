import React from 'react'
import {BiDownArrowCircle, BiUpArrowCircle} from 'react-icons/bi'
import {MdOutlineModeEdit} from 'react-icons/md'
import {RiDeleteBinLine} from 'react-icons/ri'
import {CiWarning} from 'react-icons/ci'
import Popup from 'reactjs-popup'
import './index.css'
import '../../style.css'

const TransactionItems = props => {
  const {details, isSeparator, editTransaction, deleteTransaction} = props
  const {id,transactionType, transactionName, category, date, amount} = details

  const onClickEditIcon = async () => {
    const editObject = {
      'id':id,
      'name':document.getElementById('transaction-name').value,
      'type':document.getElementById('add-transaction-select').value.toLowerCase(),
      'category':document.getElementById('transaction-category').value,
      'amount':document.getElementById('transaction-amount').value,
      'date':document.getElementById('transaction-date').value
    }
    await editTransaction(editObject)
  }

  const onClickDeleteButton = async () => {
    await deleteTransaction(id)
  }

  let transactionIcon;
  let iconClassName;
  if (transactionType==='debit'){
    transactionIcon = <BiDownArrowCircle color="red" className="transaction-icon" />
    iconClassName = 'red'
  }else{
    transactionIcon = <BiUpArrowCircle color="green" className="transaction-icon" />
    iconClassName = 'green'
  }
  const separatorClassName = isSeparator ? "separatorClassName" : ""
  return (
    <li className={`list-item-container ${separatorClassName}`}>
      <tr className="row-item">
        <td>{transactionIcon}</td>
        <td className="transaction-name">{transactionName}</td>
        <td className="category">{category}</td>
        <td className="date">{date}</td>
        <td className={`transaction-amount ${iconClassName}`}>{amount}</td>
        <td className="edit-icon">
          <Popup trigger={<MdOutlineModeEdit color="#2D60FF" size="20px" />} modal nested>
            {close => (
            <div style={{paddingTop:'12px', padding:'15px', display:'flex', flexDirection:'column'}}>
              <div className='add-transaction-header-container'>
                <div> 
                  <h1 className='add-transaction-heading'>Update Transaction</h1>
                  <p className='add-transaction-description'>You can update your transaction here</p>
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
              <button style={{marginTop:'5px',backgroundColor:'#2D60FF', border:'none', outline:'none', display:'flex', justifyContent:'center', padding:'12px', borderRadius:'10px', color:'white', fontSize:'14px'}} onClick={async event=>{
                event.target.textContent = 'Loading...';
                await onClickEditIcon();
                await close()
              }}>Update Transaction</button>
            </div>
          )}
          </Popup>
        </td>
        <td>
          <Popup trigger={<RiDeleteBinLine color="#FE5C73" size="20px"/>} modal nested>
              {close => (
                <div className="delete-modal">
                  <div style={{borderRadius:'90px', backgroundColor:'#FEF3C7', padding:'8px', marginRight:'14px', marginTop:'10px'}}> 
                    <div style={{borderRadius:'90px', backgroundColor:'#FDE68A', padding:'5px'}}>
                      <CiWarning color="#D97706" size="35px" />
                    </div>
                  </div>
                  <div>
                    <h1 className='del-popup-heading'>Are you sure you want to Delete?</h1>
                    <p className='del-popup-description'>This transaction will be deleted immediately. You can't undo this action. </p>
                    <button className='delete-popup-button' onClick={async event =>{
                      event.target.textContent='Loading...'
                      await onClickDeleteButton();
                      await close();
                    }}>Yes, Delete</button>
                    <button className='leave-popup-button' onClick={()=>{close() }}>No, Leave it</button>
                  </div>
                  <button onClick={()=>{close()}} style={{border:'none', backgroundColor:'white', fontSize:'20px', color:"#718EBF"}}>X</button>
                </div>
              )}
            </Popup>
        </td>
      </tr>
    </li>
  )
}

export default TransactionItems