import React from 'react';
import './timer.css'

const timer = (props) => {
    return (
        <div>
            <p className='timer'>{props.text} </p>
            <div className='time-count'>
                <p id='num'>{props.num} </p>
                <p id='num-text'>{props.text2} </p>
                <p id='num'>{props.num2} </p>
                <p id='num-text'>{props.text3} </p>
            </div>
        </div>
    )
}

export default timer
