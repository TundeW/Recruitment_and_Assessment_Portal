import React from 'react';
import AssessTest from '../../Components/assessText/assessTest'
import './UpdateSection.css'

function UpdateSection(props) {
    return (
        <div className='assessment'>
           <p className='assess-text'>{props.text} </p>
            <div className='testbtn'>
                <AssessTest  />
                <div className="line-body">
                <div className="text-line"></div>
                <div className="text-line"></div>
                <div className="text-line"></div>
                <div className="text-line"></div>
                </div>
            </div>
        </div>
    )
}

export default UpdateSection;
