import React from 'react'
import './topHistory.css'
import History from '../history/history'

function topHistory(props) {
    return (
        <div>
            <p className='head'>{props.head} </p>
            <p id='time'>{props.time} </p>
        </div>
    )
}

export default topHistory
