import React, { Component } from 'react';
import UserSideBar from '../../Components/usersidebar/usersidebar'
import './UserAssessment.css'
import AssessmentTimer from '../../Components/AssessmentTimer/AssessmentTimer'



class UserAssessment extends Component {

    state = {
        questionsList: [
            {
                id: 0,
                question: ` What is the Capital Of India ?`,
                options: [`New Delhi`, `Mumbai`, `Kolkatta`],
                answer: `New Delhi`
            },
            {
                id: 1,
                question: `Who is the CEO of Tesla Motors?`,
                options: [`Bill Gates`, `Steve Jobs`, `Elon Musk`],
                answer: `Elon Musk`
            },
            {
                id: 3,
                question: `Name World's Richest Man?`,
                options: [`Jeff Bezo`, `Bill Gates`, `Mark Zuckerberg`],
                answer: `Jeff Bezo`
            },
            {
                id: 4,
                question: `World's Longest River?`,
                options: [`River Nile`, `River Amazon`, `River Godavari`],
                answer: `River Nile`
            }
        ],
        currentQuestion: 0,
        myAnswer: null,
        options: [],
        score: 0,
        nextDisabled: false,
        prevDisabled: true,
        isEnd: false,
        store: {},
        assessment_id: null,
        timelimit: 0
    }

    componentDidMount(){
        const token = localStorage.getItem('token')
        const requestOptions = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'auth': token
            }
        }

        const url = 'http://localhost:5000/api/v1/assessments';

        fetch(url, requestOptions).then(response => response.json()).then(data=>{
            if (data.message){
                console.log(data.message)
            }else{
                console.log(data)
                const time = new Date();
                time.setSeconds(time.getSeconds() + data.assessment.timelimit);
                console.log(data.assessment.timelimit)
                this.setState(()=>{
                    return {
                        questionsList: data.data,
                        assessment_id: data.assessment.id,
                        timelimit: time,
                        questions: data.data[this.state.currentQuestion].question,
                        answer: data.data[this.state.currentQuestion].answer,
                        options: data.data[this.state.currentQuestion].options
                    }
                })
            }
        })

    }

    // componentDidMount() {
    //     this.setState(()=>{
    //         return{
    //             questions: this.state.questionsList[this.state.currentQuestion].question,
    //             answer: this.state.questionsList[this.state.currentQuestion].answer,
    //             options: this.state.questionsList[this.state.currentQuestion].options
    //         }
    //     })
    // }

    nextQuestionHandler = () => {
      // console.log('test')
      const {currentQuestion, myAnswer, answer, store } = this.state;

      const copy = {...store}
      const scorekey = "Q"+currentQuestion
      copy[scorekey] = [myAnswer, answer]

      this.setState({
          store: copy
      })

      this.setState({
        currentQuestion: this.state.currentQuestion + 1
      });

    };

    previousQuestionHandler = () => {
        // console.log('test')
        const {currentQuestion, myAnswer, answer, score } = this.state;


        // this.setState({
        // score: score + 1
        // });


        this.setState({
          currentQuestion: this.state.currentQuestion - 1
        });
        console.log(this.state.currentQuestion);

    };

    submitHandler = () => {
        // console.log('test')
        const {currentQuestion, myAnswer, answer, store } = this.state;
        console.log(store);
        var score = 0;
        if (myAnswer == answer){
            score = score + 1
        }

        Object.values(store).forEach((value)=>{
            if (value[0] == value[1]){
                score = score + 1
            }
        })


        let request = {assessment_id: this.state.assessment_id, assessment_score: score}
        const token = localStorage.getItem("token")

        const requestOptions = {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'auth': token
            },
            body: JSON.stringify(request),
        };

        const url = 'http://localhost:5000/api/v1/assessment/score';

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


                    this.props.history.push({
                        pathname: '/success/page'
                    })
                }
            })
            .catch(error => console.log(error));

    };



    componentDidUpdate(prevProps, prevState) {


        var next_disabled = false
        var prev_disabled = false
        if (this.state.currentQuestion === this.state.questionsList.length - 1){
            next_disabled = true
        }

        if (this.state.currentQuestion === 0){
            prev_disabled= true
      }

      if (this.state.currentQuestion !== prevState.currentQuestion) {
        this.setState(() => {
          return {
              questions: this.state.questionsList[this.state.currentQuestion].question,
              answer: this.state.questionsList[this.state.currentQuestion].answer,
              options: this.state.questionsList[this.state.currentQuestion].options,
              nextDisabled: next_disabled,
              prevDisabled: prev_disabled
          };
        });
      }
  }



    selectAnswer = answer => {
      this.setState({ myAnswer: answer, disabled: false });
    };


    render() {
        const { options, myAnswer, currentQuestion, isEnd, questions } = this.state

        return(
            <div>
                <div><UserSideBar selected='Assessment' history={this.props.history}/></div>
                <div className='assessment-container'>
                <div className="heading">
                    <h4 className="take-assessments">Take Assessment</h4>
                    <p className='assessment-requirement'>Click the finish button below to submit assessment, you can go back at any time to edit your <br /> answers.</p>
                </div>
                <div className="time">{this.state.timelimit ? <AssessmentTimer expiryTimestamp={this.state.timelimit} expire={this.submitHandler}/> : ''}</div>

                    <p className='question-number'>{`Question ${currentQuestion + 1}`}</p>
                    <p className='question-box'>{questions}</p>
                    <div>
                        {options.map((option, id) =>(
                            <div className= 'options-box' onClick={() => this.selectAnswer(option)}>
                                <div className={`select-box ${myAnswer === option ? "selected-box" : null}`}></div>
                                <p key={id} className={`text-box ${myAnswer === option ? "selected" : null}`} onClick={() => this.selectAnswer(option)}>{ option }</p>
                            </div>
                        ))}
                    </div>
                    <div>
                    <span className="prev-span"><button className='prev' disabled={this.state.prevDisabled} onClick={this.previousQuestionHandler}>Previous</button></span>
                    <span><button className= "next" disabled={this.state.nextDisabled} onClick={this.nextQuestionHandler}>Next</button></span>
                </div>
                <div className="finish-assessment"><span><button className="finish" onClick={this.submitHandler}>Submit</button></span></div>

                </div>
            </div>
        )
    }
}

export default UserAssessment;
