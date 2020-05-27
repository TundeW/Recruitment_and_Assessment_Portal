import React from 'react'
import './userDb.css'
import DashBoard from '../../Components/dashboad/dashBoard'
import blue from '../../Components/mainicons/bluerec.svg'
import green from '../../Components/mainicons/greenrec.svg'
import orange from '../../Components/mainicons/orangerec.svg'
import navicon from '../../Components/mainicons/navicon.svg'
import SideBar from '../../Components/sidebar/sideBar';
import TopHistory from '../../Components/topHistory/topHistory'
import AssessHead from '../../Components/Assessment/assessHead'
import IconLevel from '../../Components/iconLevel/iconLevel'
import Button from '../../Components/Button/Button'
import AssessTest from '../../Components/assessText/assessTest'
import History from '../../Components/history/history'


const userDb = () => {
    return (
        <div className='user-board'>
            <div><SideBar /></div>
            <div className='user-dashboard' >
                <p className='user-text'>Dashboard</p>
                <p className='user-text2'>Your Application is currently being review, you wil be notified if successful</p>
                <div className='application-section'>
                    <DashBoard app='Date of Applications' num='09:09:19' icon={blue} text2='4 days since apllied' />
                    {/* <DashBoard app='Application Status' num='Pending' icon={green} text2='We will get back to you' /> */}
                    <DashBoard app='Application Status' num='Pending' icon={orange} text2='We will get back to you' />
                </div>
                <div>
                    <IconLevel navicon={navicon} />
                </div>
                <div className='user-assessment'>
                    <div className='update-section'>
                        <AssessHead text='Updates' />
                    </div>
                    <div className='assesshead-section'>
                        <AssessHead text='Take Assessment' />
                        {/* <AssessTest text='We have 4 days left until the next assessment Watch this space' />
                        <Button text='Take Assessment' /> */}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default userDb;
