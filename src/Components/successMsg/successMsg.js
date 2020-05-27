import React from 'react';
import './successMsg.css';
import Button from '../Button/Button';

const successMsg = (props) => {
    
    return (
        <div>
            <img src={props.icon} />
            <p className='success-msg'>{props.text}<br /> Best of luck</p>
            <Button text='Take Assessment' color='user-dash' /> 
        </div>
    )
}

export default successMsg
