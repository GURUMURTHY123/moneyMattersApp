import React from 'react'
import {Component} from 'react'
import Header from '../Header'
import Card from '../Card'
import TransactionItems from '../TransactionItems'
import Barchart from '../Barchart'
import SideBar from '../SideBar'
import Cookies from 'js-cookie'
import {TailSpin} from 'react-loader-spinner'
import '../../style.css'

class Dashboard extends Component{
  state = {lastTransactionData:[], creditSum:0, debitSum:0, isLoading:true}
  parsedObject = JSON.parse(Cookies.get('userId'))

  dateObject = dateString => {
    let date = new Date(dateString)
    let month = (date.toLocaleDateString('default', {month:'short'}))
    return (`${month} ${date.getDate()}, ${date.getFullYear()}`)
  }

  addTransaction = async () => {
    const updateLastThreeTransactions = await this.getLastThreeTransactions()
    const {creditSum, debitSum} = await this.getCreditDebitTotals()
    await this.setState({lastTransactionData:updateLastThreeTransactions, creditSum:creditSum, debitSum:debitSum})
  }

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
        const updateLastThreeTransactions = await this.getLastThreeTransactions()
        const {creditSum, debitSum} = await this.getCreditDebitTotals()
        await this.setState({lastTransactionData:updateLastThreeTransactions, creditSum:creditSum, debitSum:debitSum})
      }
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
      const updateLastThreeTransactions = await this.getLastThreeTransactions()
      const {creditSum, debitSum} = await this.getCreditDebitTotals()
      await this.setState({lastTransactionData:updateLastThreeTransactions, creditSum:creditSum, debitSum:debitSum})
    }
  }
  

  getLastThreeTransactions = async () => {
      const url = "https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=80&offset=0"
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
        const updatedData= responseData.transactions.map(eachData=>({
            amount:eachData.amount,
            category:eachData.category,
            date:this.dateObject(eachData.date),
            id:eachData.id,
            transactionName:eachData.transaction_name,
            transactionType:eachData.type,
            userId:eachData.user_id
          }
          )
        )
        const sortedUpdatedData = updatedData.sort((a,b)=>{
          return new Date(a.date)-new Date(b.date)
        })

        return (sortedUpdatedData.slice(0,3))}
      
  }

  getCreditDebitTotals= async () => {
    let creditSum=0;
    let debitSum=0;
    const url="https://bursting-gelding-24.hasura.app/api/rest/credit-debit-totals"
    const options = {
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        Accept:'application/json',
        'x-hasura-admin-secret':'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
        'x-hasura-role':'user',
        'x-hasura-user-id':this.parsedObject.id
      }
    }
    const response = await fetch(url, options)
    if (response.ok===false){
      const {history} = this.props
      history.push({
        pathname:'/failure',
        state:{responseStatus:response.status,responseText:response.statusText}
      });
    }else{
      const creditDebitData = await response.json()
      const {totals_credit_debit_transactions} = creditDebitData
      const obtainedCreditDebitData = (totals_credit_debit_transactions)
      for (let eachData of obtainedCreditDebitData){
        if (eachData.type === 'debit'){
            debitSum = eachData.sum
        }else{
          creditSum = eachData.sum
        }
      }
      return {creditSum, debitSum}
  }
  }

  componentDidMount = async ()=>{
    let {creditSum, debitSum} = await this.getCreditDebitTotals()
    const obtainedLastThreeTransactions = await this.getLastThreeTransactions()
    this.setState({creditSum:creditSum, debitSum:debitSum, lastTransactionData:obtainedLastThreeTransactions, isLoading:false}) 
  }

  render(){
    const {creditSum, debitSum, lastTransactionData, isLoading} = this.state
    return(
      <>
        <SideBar activeLinkElement="Dashboard"  />
        <div className="route-container">
          <Header header="Accounts" addTransaction={this.addTransaction} />
          {isLoading ? (
            <div className="load-container"><TailSpin height="50" width="50" color="#00BFFF" ariaLabel="tail-spin-loading" radius="1" wrapperStyle={{margin:20, padding:10}} wrapperClass="" visible={true} /></div>
          ) : (
          <div className="card-container">
            <div className="cards-container"> 
              <Card type="Credit" totalAmount={creditSum}/>
              <Card type="Debit" totalAmount={debitSum}/>
            </div>
            <h1 className="dashboard-header">Last Transaction</h1>
            <ul className="transaction-list-container">
              {lastTransactionData.map(eachItem=>{
                if (lastTransactionData[0].id === eachItem.id){
                  return <TransactionItems details={eachItem} key={eachItem.id}  isSeparator={false} editTransaction={this.editTransaction} deleteTransaction={this.deleteTransaction} />
                }
                return <TransactionItems details={eachItem} key={eachItem.id}  isSeparator={true} editTransaction={this.editTransaction} deleteTransaction={this.deleteTransaction} />
              })}
              {/* <TransactionItems details={lastTransactionData[0]} key={lastTransactionData[0].id}  isTransactionRoute={false} />
                <hr className="separator"/>
              <TransactionItems details={lastTransactionData[1]} key={lastTransactionData[1].id}  isTransactionRoute={false} />
                <hr className="separator" />
              <TransactionItems details={lastTransactionData[2]} key={lastTransactionData[2].id}  isTransactionRoute={false} /> */}
            </ul>
            <h1 className="dashboard-header">Debit & Credit Overview</h1>
            <div className="barchart-container">
              <Barchart />
            </div>
          </div>
          )}
        </div>
      </> 
    )
  }
}

export default Dashboard

