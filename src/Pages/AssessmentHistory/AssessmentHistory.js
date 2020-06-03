import React,{useState,useEffect} from 'react';
import FormInput from '../../Components/FormInput/FormInput';
import Button from '../../Components/Button/Button'
import './AssessmentHistory.css'
import SideBar from '../../Components/sidebar/sideBar'
import plusicon from '../../Components/mainicons/plus icon.svg'

function AssessmentHistory(props) {

const [sortby, setSortby] = useState('default')
const [batch, setBatch] = useState(1)

const [assess, setAssess] = useState([])
const [state, setState] = useState({
file: "",
question: "",
option_a: "",
option_b: "",
option_c: "",
option_d: "",
answer: ""
})


useEffect(()=>{
    const token = localStorage.getItem('token')
    const requestOptions = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'auth': token
        }
    }

    const url = 'http://localhost:5000/api/v1/assessments/all';

    fetch(url, requestOptions).then(response => response.json()).then(data=>{
        if (data.message){
            console.log(data.message)
        }else{
            console.log(data.response)
            console.log(data.data)
            setAssess([...data.data])

        }
    })
},[])

const fileChange = e => {
    e.preventDefault()
    setState({
        ...state,
        file: e.target.files[0]
    })
}

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
        option_d: "",
        answer: ""
    })
}

const changeDateformat = (date_of_birth) =>{
    const birthDate = new Date(date_of_birth);
    const month = birthDate.getMonth() + 1
    return birthDate.getDate() + '/' + month + '/' + birthDate.getFullYear()
}

const changeTimeFormat =(num) =>{
    let minute = Math.floor(num/60);
    let seconds = num % 60;
    let min = minute ? minute + " Minutes" : '';
    let sec = seconds ? seconds + ' Seconds' : '';
    return min + ' ' + sec
}


return (
    <div>
        <SideBar selected='Assessment History' history={props.history}/>
        <br/>
        <div className="assessment-history">
            <h2>Assessment History</h2>
            <div className='hist-back'>
                <div className='Hist-table'>
                    {assess.length !== 0 ?
                        <table>
                            <thead>
                                <tr>
                                    <th>Batch</th>
                                    <th>Date composed</th>
                                    <th >No of Questions </th>
                                    <th>Time Allocated</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...assess].map((entry, id) => {
                                    return (
                                        <tr key={entry.id} className='assess_row'>
                                            <td>{entry.application_id}</td>
                                            <td>{changeDateformat(entry.created_at)}</td>
                                            <td>{entry.questions_total} </td>
                                            <td>{changeTimeFormat(entry.timelimit)}</td>
                                            <td>{entry.status}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table> : <div>There are no applications to review</div>
                    }
                </div>
            </div>
            <div>
                <div className='Assess-History-section'>
                    <div className="upload-assessment-file">
                    <input type="file" id="file" name= "file"  onChange={fileChange}/>
                    <div className="file-text"><label for="file" >Choose file</label></div>
                    <div className="plusicon"><img src = {plusicon} alt="plus-icon" /></div>
                    <div>{state.file ? state.file.name: ""}</div>
                </div>
                <br/>
                <div></div>
                <div></div>
            </div>
        </div>
        <div className="assessment-history-input">
            <p>Questions</p>
            <textarea name="question" value= {state.question} className="assessment-instruction" onChange= {handleChange} ></textarea>
            <div className="compose-assessment-input">
                <FormInput label="Option A" type='text' name="option_a" value= {state.option_a} change= {handleChange} labelColor="label-name" color="admin-application-forminput"/>
                <FormInput label="Option B" type='text' name="option_b" value= {state.option_b} change= {handleChange} labelColor="label-name" color="admin-application-forminput"/>
            </div>
            <div className="compose-assessment-input">
                <FormInput label="Option C" type='text' name="option_c" value= {state.option_c} change= {handleChange} labelColor="label-name" color="admin-application-forminput"/>
                <FormInput label="Option D" type='text' name="option_d" value= {state.option_d} change= {handleChange} labelColor="label-name" color="admin-application-forminput"/>
            </div>
            <div className="compose-assessment-answers">
                <FormInput label="Answer" type='text' name="answer" value= {state.answer} change= {handleChange} labelColor="label-name" color="admin-application-forminput"/>
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
