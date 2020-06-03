import React from 'react'
import './assessHead.css'
import Button from '../Button/Button'
import AssessTest from '../assessText/assessTest'

const assessHead = (props) => {
    const click = () =>{
        if(props.from == 'admin'){
            props.history.push({
                pathname: '/compose/assessment/' + props.batch
            })
        }
        if(props.from == 'applicant'){

            props.history.push({
                pathname: '/assessment/start'
            })
        }

    }
    return (
        <div className='assessment' >
            <p className='assess-text'>{props.text} </p>
            <div className='testbtn'>
            <br/>
                <AssessTest text={props.content_one}  />
                <p> {props.content_two}</p>
                <br />
                <span onClick={click}><Button text={props.text} color="finish-button"/></span>
            </div>
        </div>
    )
}

export default assessHead
