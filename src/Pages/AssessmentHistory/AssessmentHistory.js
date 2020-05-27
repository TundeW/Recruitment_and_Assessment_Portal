import React,{useState} from 'react';
import FormInput from '../../Components/FormInput/FormInput';
import Button from '../../Components/Button/Button'
import './AssessmentHistory.css'
import SideBar from '../../Components/sidebar/sideBar'

function AssessmentHistory() {
    const [state, setState] = useState({
        file: "",
        question: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: ""
    })

    const handleChange = e => {
        e.preventDefault()
        setState({
            ...state,
            [e.target.name]: [e.target.value]   
        })
    }

    const submitForm = (e) => {
        e.preventDefault()
        console.log(state)
        setState({
            file: "",
            question: "",
            option_a: "",
            option_b: "",
            option_c: "",
            option_d: ""
        })
    }
    return (
        <div>
            <SideBar />
            <br/>
            <div className="assessment-history">
               <h2>Assessment History</h2>
                   <div>
                 <div>
                       <div className="upload-assessment-file">
                       <input type="file" id="file" name="file" value={state.file} onChange={handleChange}/>
                        <span class="btn"  >Choose file</span>
                        </div> 
                    <div></div>
                    <div></div>
                 </div>
                 </div>
               <div className="assessment-history-input">
               <p>Questions</p>
                   <textarea  name="question" value= {state.question} className="assessment-instruction" onChange= {handleChange} ></textarea> 
               <div className="compose-assessment-input">
               <FormInput label="Option A" type='text' name="option_a" value= {state.option_a} change= {handleChange} labelColor="label-name"  color="admin-application-forminput"/>
               <FormInput label="Option B" type='text' name="option_b" value= {state.option_b} change= {handleChange} labelColor="label-name" color="admin-application-forminput"/>
               </div>
                <div className="compose-assessment-input">
                <FormInput label="Option C" type='text' name="option_c" value= {state.option_c} change= {handleChange} labelColor="label-name"  color="admin-application-forminput"/>
                <FormInput label="Option D" type='text' name="option_d" value= {state.option_d} change= {handleChange}  labelColor="label-name" color="admin-application-forminput"/>
                </div>
                <div className="assessment-history-button">
                <span onClick={ submitForm}><Button text="Next" color="Button" /></span>
                </div>
                </div>
                </div>
            </div>
    )
}

export default AssessmentHistory;
