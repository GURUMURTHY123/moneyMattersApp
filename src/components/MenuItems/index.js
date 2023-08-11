import React from 'react'
import {Link} from 'react-router-dom'
import './index.css'
import {Fragment} from 'react'

const MenuItems = props => {
    const {linkData, isActive} = props
    const {text, path, icon} = linkData

    return (
      <Fragment>
          <Link to={path} className="link">
            <div className={`link-container 
              ${isActive ? 'activeLinkContainer' : ""}
            `}>
              <span className={`icon 
              ${isActive ? 'activeLinkIcon' : ""}
            `}>{icon}</span>
              <p className={`link-description 
              ${isActive ? 'activeLinkDescription' : ""}
            `}>{text}</p>
            </div>
          </Link>
      </Fragment>
    )
}

export default MenuItems
