import React, { useState, useEffect } from 'react';
import './takeAssessment.css';
import SideBar from '../../Components/sidebar/sideBar';
import TakeAssment from '../../Components/takeAssmnt/takeAssment';
import Timer from '../../Components/timer/timer'
import IconLevel from '../../Components/iconLevel/iconLevel';
import SuccessMsg from '../../Components/successMsg/successMsg';
import hourglass from '../../Components/mainicons/hourglass.svg';
import navicon from '../../Components/mainicons/navicon.svg';
import Button from '../../Components/Button/Button';
import UserSideBar from '../../Components/usersidebar/usersidebar'


const TakeAssessment = (props) => {
    const [state, setState] = useState({})

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(!token){
            props.history.push({
                pathname: '/signin'
            })
        }
        const requestOptions = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'auth': token
            }
        }

        const url = 'http://localhost:5000/api/v1/applicant/details';

        fetch(url, requestOptions).then(response => response.json()).then(data=>{
            if (data.message){
                console.log(data.message)
            }else{
                console.log(data.response)
                console.log(data.data)
                setState(data.data)
            }
        })
    }, [])

    const goToAssessment=()=>{
        props.history.push({
            pathname: '/user/assessment'
        })
    }
    return (
        <div className='Ass-page'>
            <UserSideBar selected='Assessment' history={props.history}/>
            <div className='take-assessment'>
                <div className='assessment-time'>
                    <TakeAssment
                        text='Take Assessment'
                        text2='Click the button below to start assessment, you have limited time for this test' color="finish-button"
                    />
                    <Timer text='Timer' text2='min' text3='sec' num='00' num2='000' />
                </div>
                {state.assessment_status == 'true' ?<div> You have completed this assessment, You cannot take it more than once</div>:<div className='ass-mesg'>
                    <SuccessMsg icon={hourglass} text='We have 4 days left until the next assessment Watch this space' color="finish-button" />
                    <span onClick={goToAssessment}><Button color="finish-button" text="Take Assessment"/></span>
                </div> }
            </div>
        </div>
    )
}

export default TakeAssessment