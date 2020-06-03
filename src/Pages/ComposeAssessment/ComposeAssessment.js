import React,{useState,useEffect} from 'react';
import FormInput from '../../Components/FormInput/FormInput';
import Button from '../../Components/Button/Button'
import './ComposeAssessment.css'
import SideBar from '../../Components/sidebar/sideBar'
import plusicon from '../../Components/mainicons/plus icon.svg'
import sort from '../../Components/mainicons/sort.svg';

function ComposeAssessment(props) {
    const [state, setState] = useState({
        file: "",
        question: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        answer: ''
    })

    const [assessment, setAssessment] = useState({
        application_id: null,
        time_min: '00',
        time_sec: '000'
    })

    const [questionList, updateQuestionList] = useState([])
    const [questionNav, setQuestionNav] = useState({
        currentQuestion: 0,
        prevDisabled: true,
        nextDisabled: false
    })

    useEffect(()=>{
        const { id } = props.match.params;
        setAssessment({...assessment, application_id: id})
    },[])

    const handleChange = e => {
        e.preventDefault()
        setState({
            ...state,
            [e.target.name]: [e.target.value]
        })
    }

    const assessmentChange = e => {
        e.preventDefault()
        setAssessment({
            ...assessment,
            [e.target.name]: e.target.value
        })
    }

    const fileChange = e => {
        e.preventDefault()
        setState({
            ...state,
            file: e.target.files[0]
        })
    }


    const nextQuestionHandler = () =>{
        const { currentQuestion } = questionNav
        console.log(questionNav)
        console.log(questionList)

        if(currentQuestion == questionList.length){
            if (state.question && state.option_a && state.option_b && state.answer){
                updateQuestionList([...questionList, state])

                setState({
                    file: "",
                    question: "",
                    option_a: "",
                    option_b: "",
                    option_c: "",
                    option_d: "",
                    answer: "",
                })

                setQuestionNav({
                    currentQuestion: currentQuestion + 1,
                    prevDisabled: false,
                })
            }

        }else if(currentQuestion == questionList.length-1){
            if(state.question && state.option_a && state.option_b && state.answer){
                let copy = [...questionList]
                copy[currentQuestion] = state
                updateQuestionList([...copy])

                setState({
                    file: "",
                    question: "",
                    option_a: "",
                    option_b: "",
                    option_c: "",
                    option_d: "",
                    answer: "",
                })

                setQuestionNav({
                    currentQuestion: currentQuestion + 1,
                    prevDisabled: false,
                })
            }

        }else{
            if(state.question && state.option_a && state.option_b && state.answer){
                let copy = [...questionList]
                copy[currentQuestion] = state
                updateQuestionList([...copy])

                setState({
                    file: questionList[currentQuestion + 1].file,
                    question: questionList[currentQuestion + 1].question,
                    option_a: questionList[currentQuestion + 1].option_a,
                    option_b: questionList[currentQuestion + 1].option_b,
                    option_c: questionList[currentQuestion + 1].option_c,
                    option_d: questionList[currentQuestion + 1].option_d,
                    answer: questionList[currentQuestion + 1].answer,
                })

                setQuestionNav({
                    currentQuestion: currentQuestion + 1,
                    prevDisabled: false,
                })
            }

        }

    }

    const previousQuestionHandler = () => {
        const { currentQuestion } = questionNav
        if (currentQuestion == 1){
            let copy = [...questionList]
            copy[currentQuestion] = state
            updateQuestionList([...copy])

            setState({
                file: questionList[currentQuestion - 1].file,
                question: questionList[currentQuestion - 1].question,
                option_a: questionList[currentQuestion - 1].option_a,
                option_b: questionList[currentQuestion - 1].option_b,
                option_c: questionList[currentQuestion - 1].option_c,
                option_d: questionList[currentQuestion - 1].option_d,
                answer: questionList[currentQuestion - 1].answer,
            })

            setQuestionNav({
                currentQuestion: currentQuestion - 1,
                prevDisabled: true,
            })
        }else{
            if(state.question && state.option_a && state.option_b && state.answer){
                let copy = [...questionList]
                copy[currentQuestion] = state
                updateQuestionList([...copy])
            }


            setState({
                file: questionList[currentQuestion - 1].file,
                question: questionList[currentQuestion - 1].question,
                option_a: questionList[currentQuestion - 1].option_a,
                option_b: questionList[currentQuestion - 1].option_b,
                option_c: questionList[currentQuestion - 1].option_c,
                option_d: questionList[currentQuestion - 1].option_d,
                answer: questionList[currentQuestion - 1].answer,
            })

            setQuestionNav({
                currentQuestion: currentQuestion - 1,
                prevDisabled: false,
            })
        }

    }

    const addQuestions = async (questions, assessment_id, token) =>{
        console.log('inner function is running')
        questions.map(question => {
            var formData = new FormData()
            for (var key in question){
                formData.append(key, question[key])
            }
            formData.append('assessment_id', assessment_id)

            const requestOptions = {
                method: 'post',
                headers: {
                    'auth': token
                },
                body: formData,
            };

            const url = 'http://localhost:5000/api/v1//auth/admin/question/create';
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
        })
    }

    const submitForm = async (e) => {
        e.preventDefault()
        let questionRequest = questionList
        let timelimit = (parseInt(assessment.time_min) * 60) + parseInt(assessment.time_sec)
        let questions_total = questionList.length
        let assRequest = {...assessment, timelimit, questions_total}
        //Removing the time_min and time_sec from my object request cause I don't need it anymore
        let assessmentRequest = (({time_min, time_sec, ...o}) => o)(assRequest)
        // setState({
        //     file: "",
        //     question: "",
        //     option_a: "",
        //     option_b: "",
        //     option_c: "",
        //     option_d: "",
        //     answer: "",
        // })
        console.log(assessmentRequest)

        const token = localStorage.getItem("token")

        const requestOptions = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'auth': token
            },
            body: JSON.stringify(assessmentRequest),
        };

        const url = 'http://localhost:5000/api/v1//auth/admin/assessment/create';
        console.log('apple')
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
                    // console.log(data.data.token)
                    // console.log(data.user)

                    let assessment_id = data.data
                    console.log('assessment_id: ' + assessment_id)
                    addQuestions(questionRequest, assessment_id, token)

                    props.history.push({
                        pathname: '/admin/dashboard'
                    })
                }
            })
            .catch(error => console.log(error));


    }
    return (
        <div>
            <SideBar selected='Compose Assessment' history={props.history}/>
            <br />
             <div className="compose-assessment-form">
               <h2>Compose Assessment</h2>
               <div className='file_timer'>
                   <div className="question-number">Question {questionNav.currentQuestion + 1}</div>
                       <div className="upload-document-file">
                       <input type="file" id="file" name= "file"  onChange={fileChange}/>
                       <div className="file-text"><label for="file" >Choose file</label></div>
                       <div className="plusicon"><img src = {plusicon} alt="plus-icon" /></div>
                       <div>{state.file ? state.file.name: ""}</div>
                         </div>
                    <div>
                    <span className='span_timer'>
                        <div className='span-timer'>
                            <input id='select-timer' type='number' name='time_min' value={assessment.time_min} onChange={assessmentChange} />
                            <p id='min'>min</p>
                            <img id='sortbtn' src={sort} />
                        </div>
                        <div className='span-timer'>
                            <input id='select-timer' type='number' name='time_sec' value={assessment.time_sec} onChange={assessmentChange} />
                            <p id='sec'>sec</p>
                            <img id='sortbtn' src={sort} />
                        </div>
                    </span>
                    </div>
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
                <div className="compose-assessment-answers">
                <FormInput label="Answer" type='text' name="answer" value= {state.answer} change= {handleChange}  labelColor="label-name"  color="admin-application-forminput"/>
                </div>

                <div className="compose-assessment-button">
                <span><button className='previous' disabled={questionNav.prevDisabled} onClick={previousQuestionHandler}>Previous</button></span>
                <span><button className= "next-question" disabled={questionNav.nextDisabled} onClick={nextQuestionHandler}>Next</button></span>
                </div>
                <div className="finish-btn">
                <span onClick={submitForm}><Button text="Finish" color="finish-button" /></span>
                </div>
        </div>
        </div>
    )
}

export default ComposeAssessment;
