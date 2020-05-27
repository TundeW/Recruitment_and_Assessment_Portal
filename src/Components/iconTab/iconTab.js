import React from 'react'
import './iconTab.css'
import { NavLink, Link } from 'react-router-dom'

const iconTab = (props) => {
    return (
        <div>
            <li className='icon-tab-bar'>
                    {/* <img src={props.icon} className='grn' /> */}
                <img src={props.img} className="tab-icon" alt="tab-icon" />
                {/* <NavLink> {props.text} </NavLink> */}
                <Link to={props.link} className='tab-link'>{props.text} </Link>
            </li>
        </div>
    )
}

export default iconTab
