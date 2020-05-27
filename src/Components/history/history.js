import React from 'react'
import './history.css'

const history = (props) => {
    return (
        <div className='history-content'>
            <p>{props.batch}</p>
            <p>{props.students}</p>
            <p>{props.date} </p>
        </div>
    )
}

export default history
