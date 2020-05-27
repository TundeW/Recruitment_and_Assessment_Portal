import React,{useState} from 'react';
import FormInput from '../../Components/FormInput/FormInput';
import Button from '../../Components/Button/Button'
import './ComposeAssessment.css'
import SideBar from '../../Components/sidebar/sideBar'

function ComposeAssessment() {
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
            <br />
             <div className="compose-assessment-form">
               <h2>Compose Assessment</h2>
               <div>
                   <div className="question-number">15/30</div>
                       <div className="upload-document-file">
                       <input type="file" id="file" name= "file" value={state.file} onChange={handleChange}/>
                        <span class="btn" >Choose file</span>
                         </div> 
                    <div></div>
               </div>
               <div>
               <p className="admin-questions">Questions</p>
                   <textarea className="question-area" name="question" value= {state.question} onChange={handleChange} ></textarea> 
               </div>
               <div className="compose-assessment-input">
               <FormInput label="Option A" type='text' name="option_a" value= {state.option_a} change= {handleChange} labelColor="label-name"  color="admin-application-forminput"/>
                <FormInput label="Option B" type='text' name="option_b" value= {state.option_b} change= {handleChange}  labelColor="label-name" color="admin-application-forminput"/>
               </div>
                <div className="compose-assessment-input">
                <FormInput label="Option C" type='text' name="option_c" value= {state.option_c} change= {handleChange}  labelColor="label-name"  color="admin-application-forminput"/>
                <FormInput label="Option D" type='text' name="option_d" value= {state.option_d} change= {handleChange} labelColor="label-name" color="admin-application-forminput"/>
                </div>
                <div className="compose-assessment-button">
                <Button text="Previous" color="assessment-button"/>
                <Button text="Next" color="assessment-button" className="next-button"/>
                </div>
                <div className="finish">
                <span onClick={submitForm}><Button text="Finish" color="finish-button" /></span>
                </div>
        </div>
        </div>
    )
}

export default ComposeAssessment;
