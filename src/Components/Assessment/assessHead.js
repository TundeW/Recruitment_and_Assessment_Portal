import React from 'react'
import './assessHead.css'
import Button from '../Button/Button'
import AssessTest from '../assessText/assessTest'

const assessHead = (props) => {
    return (
        <div className='assessment' >
            <p className='assess-text'>{props.text} </p>
            <div className='testbtn'>
            <br/>
                <AssessTest text={props.content_one}  />
                <p> {props.content_two}</p>
                <br />
                <Button text={props.text} color="finish-button"/>
            </div>
        </div>
    )
}

export default assessHead
