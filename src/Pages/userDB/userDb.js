import React, {useState, useEffect} from 'react'
import './userDb.css'
import DashBoard from '../../Components/dashboad/dashBoard'
import blue from '../../Components/mainicons/bluerec.svg'
import green from '../../Components/mainicons/greenrec.svg'
import orange from '../../Components/mainicons/orangerec.svg'
import navicon from '../../Components/mainicons/navicon.svg'
import TopHistory from '../../Components/topHistory/topHistory'
import AssessHead from '../../Components/Assessment/assessHead'
import IconLevel from '../../Components/iconLevel/iconLevel'
import Button from '../../Components/Button/Button'
import AssessTest from '../../Components/assessText/assessTest'
import History from '../../Components/history/history'
import UpdateSection from '../../Components/UpdateSection/UpdateSection'
import UserSideBar from '../../Components/usersidebar/usersidebar'


const UserDb = (props) => {
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
                console.log(state)
            }
        })
    }, [])

    const changeDateformat = (date_of_birth) =>{
        const birthDate = new Date(date_of_birth);
        const raw_day = birthDate.getDate()
        const day = `0${raw_day}`
        const raw_month = birthDate.getMonth() + 1
        const month = `0${raw_month}`
        const year = birthDate.getFullYear().toString()
        return day.slice(-2) + ':' + month.slice(-2) + ':' + year.slice(2)
    }

    const removeUser = () =>{
        localStorage.clear()
        props.history.push({
            pathname: '/signin'
        })
    }


    // const new_update = state.assessment_status ? '': 'You have completed the assessment. Your application will be reviewed.'
    // console.log(state.assessment_status)
    // console.log(new_update)
    const status = state.status
    return (
        <div className='user-board'>
            <div><UserSideBar selected='Dashboard' history={props.history}/></div>
            <div className='user-dashboard' >
                <p className='user-text'>Dashboard</p>
                <p className='user-text2'>Your Application is currently being review, you wil be notified if successful</p>
                <div className='application-section'>
                    <DashBoard app='Date of Applications' num={changeDateformat(state.created_at)} icon={blue} text2='4 days since apllied' />
                    <DashBoard app='Application Status' num={status} icon={orange} text2='We will get back to you' />
                </div>

                <div className='user-assessment'>
                    <div className='update-section'>
                        <UpdateSection text='Updates' update={state.assessment_status}/>
                    </div>
                    <div className='assesshead-section'>
                        <AssessHead text='Take Assessment' content_one="We have 4 days left until the next assessment" content_two= "Watch this space" history={props.history} from='applicant'/>
                        {/* <AssessTest text='We have 4 days left until the next assessment Watch this space' />
                        <Button text='Take Assessment' /> */}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default UserDb;
