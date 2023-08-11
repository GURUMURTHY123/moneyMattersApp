import React from 'react'
import '../../style.css'

const TransactionHeader = props => {
  const {linkData, getActiveLink, isActive} = props
  const {id, text} = linkData
  const activeClassName = isActive? "activeClassName" : ""
  const onClickLinkElement = () => {
    getActiveLink(id)
  }

  return(
    <button className={`transaction-button-element ${activeClassName}`} onClick={onClickLinkElement} ><li>{text}</li></button>
  )
}

export default TransactionHeader