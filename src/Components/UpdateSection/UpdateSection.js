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
                {props.update == 'true' ? <div className="text-line">You have completed the assessment. Your application is being reveiwed.</div> : null}

                <div className="text-line">Your application has been received. Proceed to take your assessment</div>
                <div className="text-line"></div>
                { props.update == 'true' ? null : <div className="text-line"></div>}
                </div>
            </div>
        </div>
    )
}

export default UpdateSection;
