import React from 'react'
import './assessHead.css'
import Button from '../Button/Button'
import AssessTest from '../assessText/assessTest'

const assessHead = (props) => {
    return (
        <div className='assessment' >
            <p className='assess-text'>{props.text} </p>
            <div className='testbtn'>
                <AssessTest text='Create test question for an incoming academy students' />
                {/* <p id='test'>Create test question for an incoming academy students</p> */}
                <Button text={props.text} />
            </div>
        </div>
    )
}

export default assessHead