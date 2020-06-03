import React from 'react';
import './successMsg.css';
import Button from '../Button/Button';

const successMsg = (props) => {
    
    return (
        <div>
            <img src={props.icon} />
            <p className='success-msg'>{props.text}<br /> Best of luck</p>
        </div>
    )
}

export default successMsg
