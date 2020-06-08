import React,{useState,useEffect} from 'react';
import FormInput from '../../Components/FormInput/FormInput';
import Button from '../../Components/Button/Button'
import './AssessmentHistory.css'
import SideBar from '../../Components/sidebar/sideBar'
import plusicon from '../../Components/mainicons/plus icon.svg'

function AssessmentHistory(props) {

const [assess, setAssess] = useState([])
const [state, setState] = useState({
    file: "",
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    answer: "",
    id: "",
    assessment_id: ""
})
const [edit, setEdit] = useState(false)

const [assessmentid, setAssessmentid] = useState()

const[questionList, setQuestionList] = useState([])
const [currentQuestion, setCurrentQuestion] = useState(0)



useEffect(()=>{
    const token = localStorage.getItem('token')
    if(!token){
        props.history.push({
            pathname: '/admin/login'
        })
    }
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
    if (edit){
        setState({
            ...state,
            file: e.target.files[0]
        })
    }

}

const handleChange = e => {
    e.preventDefault()
    if (edit) {
        setState({
            ...state,
            [e.target.name]: [e.target.value]
        })
    }

}

const toggleEdit = () =>{
    setEdit(!edit)
}


const updateQuestion = async (question, token) =>{
    console.log('inner function is running')

        var formData = new FormData()
        for (var key in question){
            formData.append(key, question[key])
        }

        const requestOptions = {
            method: 'put',
            headers: {
                'auth': token
            },
            body: formData,
        };

        const url = 'http://localhost:5000/api/v1//auth/admin/question/update';
        console.log('before fetch')
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    // Here you should have logic to handle invalid creation of a user.
                    // This assumes your Rails API will return a JSON object with a key of
                    // 'message' if there is an error with creating the user, i.e. invalid username
                    console.log(data.message)
                } else {
                    console.log(data.response)
                 }
            })
            .catch(error => console.log(error));

}


const submitForm = (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")

    updateQuestion(state, token)
    if(currentQuestion < questionList.length-1){
        setCurrentQuestion(currentQuestion + 1);
        setState({
            file: questionList[currentQuestion + 1].image,
            question: questionList[currentQuestion + 1].question,
            option_a: questionList[currentQuestion + 1].options[0],
            option_b: questionList[currentQuestion + 1].options[1],
            option_c: questionList[currentQuestion + 1].options[2],
            option_d: questionList[currentQuestion + 1].options[3],
            answer: questionList[currentQuestion + 1].answer,
            id: questionList[currentQuestion + 1].id,
            assessment_id: questionList[currentQuestion + 1].assequestionList
        })
    }
    // console.log(state)
    // setState({
    //     file: "",
    //     question: "",
    //     option_a: "",
    //     option_b: "",
    //     option_c: "",
    //     option_d: "",
    //     answer: ""
    // })
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

const selectAssessment = id => {
  setAssessmentid(id);
  const token = localStorage.getItem('token')
  const request = parseInt(id)

  const requestOptions = {
      method: 'get',
      headers: {
          'Content-Type': 'application/json',
          'auth': token,
          'assessment_id': request
      }
  }

  const url = 'http://localhost:5000/api/v1/admin/assessment';

  fetch(url, requestOptions).then(response => response.json()).then(data=>{
      if (data.message){
          console.log(data.message)
      }else{
          console.log(data)
          setQuestionList([...data.data])
          setState({
              file: data.data[currentQuestion].image,
              question: data.data[currentQuestion].question,
              option_a: data.data[currentQuestion].options[0],
              option_b: data.data[currentQuestion].options[1],
              option_c: data.data[currentQuestion].options[2],
              option_d: data.data[currentQuestion].options[3],
              answer: data.data[currentQuestion].answer,
              id: data.data[currentQuestion].id,
              assessment_id: data.data[currentQuestion].assessment_id
          })
          setCurrentQuestion(0)
          // const time = new Date();
          // time.setSeconds(time.getSeconds() + data.assessment.timelimit);
          // console.log(data.assessment.timelimit)
          // this.setState(()=>{
          //     return {
          //         questionsList: data.data,
          //         assessment_id: data.assessment.id,
          //         timelimit: time,
          //         questions: data.data[this.state.currentQuestion].question,
          //         answer: data.data[this.state.currentQuestion].answer,
          //         options: data.data[this.state.currentQuestion].options
          //     }
          // })
      }
  })

};

return (
    <div>
        <SideBar selected='Assessment History' history={props.history}/>
        <br/>
        <div className="assessment-history">
            <h2>Assessment History</h2>
            <div className='ass-back'>
                <div className='ass-table'>
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
                                        <tr key={entry.id} className={`assess_row ${assessmentid == entry.id ? "assessmentSelected" : null}`} onClick={() => selectAssessment(entry.id)}>
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
            <div className='file-time-button'>
                <div className='Assess-History-section'>
                    <div className="upload-assessment-file">
                        <input type="file" id="file" name= "file"  onChange={fileChange}/>
                        <div className="file-text"><label for="file" >Choose file</label></div>
                        <div className="plusicon"><img src = {plusicon} alt="plus-icon" /></div>
                        <div>{state.file ? state.file.name: ""}</div>
                    </div>
                    <div><button onClick = {toggleEdit} className = {`edit-button ${edit ? 'ena-button' : 'dis-button'}`}>Edit {edit ? 'true': 'false'}</button></div>

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
