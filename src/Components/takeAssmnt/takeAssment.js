import React from 'react';
import './takeAssment.css'

const takeAssment = (props) => {
    return (
        <div>
            <p className='take'>{props.text} </p>
            <p className='thanks'>{props.text2} </p>
        </div>
    )
}

export default takeAssment
