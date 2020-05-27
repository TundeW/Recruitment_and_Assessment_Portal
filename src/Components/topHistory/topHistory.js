import React from 'react'
import './topHistory.css'
import History from '../history/history'

function topHistory(props) {
    return (
        <div>
            <p className='head'>{props.head} </p>
            <p id='time'>{props.time} </p>
            <History batch='Academy Batch 1' students='15 students' date='started 11/09/15' />
            <History batch='Academy Batch 1' students='15 students' date='started 11/09/15' />
            <History batch='Academy Batch 1' students='15 students' date='started 11/09/15' />
        </div>
    )
}

export default topHistory