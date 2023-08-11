import React from 'react'
import creditLogo from '../../creditImage.svg'
import debitLogo from '../../debitImage.svg'
import './index.css'

const Card = props => {
  const {type, totalAmount} = props
  let logo;
  let color;
  if (type==="Debit"){
    logo = debitLogo
    color = "debit"
  }else{
    logo = creditLogo
    color = "credit"
  }
  return (
    <div className="credit-card-container"> 
      <div className="credit-detail-container">
        <span className={`amount ${color}`}>${totalAmount}</span>
        <span className="transaction-detail">
          {type}
        </span>
      </div>
      <img src={logo} alt="credit-image" className="card-image" />
    </div>
  )
}

export default Card