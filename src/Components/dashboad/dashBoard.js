import React from 'react'
import './dashboard.css'

const dashBoard = (props) => {
    return (
        <div className='dash-bar'>
            <p className='dash-text'>{props.app} </p>
            <p className='dash-num'>{props.num} </p>
            <img src={props.icon} alt="blue" />
            <p className='dash-text2'>{props.text2} </p>
        </div>
    )
}

export default dashBoard
