import React from 'react';
import './adminDb.css';
import DashBoard from '../../Components/dashboad/dashBoard';
import blue from '../../Components/mainicons/bluerec.svg';
import green from '../../Components/mainicons/greenrec.svg';
import orange from '../../Components/mainicons/orangerec.svg';
import navicon from '../../Components/mainicons/navicon.svg';
import SideBar from '../../Components/sidebar/sideBar';
import TopHistory from '../../Components/topHistory/topHistory';
import AssessHead from '../../Components/Assessment/assessHead';
import IconLevel from '../../Components/iconLevel/iconLevel';
import History from '../../Components/history/history'

const adminDb = () => {
    return (
        <div className='mainpage'>
            <div><SideBar /></div>
            <div className='dashboard' >
                <p className='dashtext'>Dashboard</p>
                <div className='dashboard-section'>
                    <DashBoard app='Current Applications' num='233' icon={blue} text2='Academy 2.0' />
                    <DashBoard app='Total Applications' num='4253' icon={green} text2='All entries so far' />
                    <DashBoard app='Academys' num='4' icon={orange} text2='So far' />
                </div>
                <div>
                    <IconLevel navicon={navicon} />
                </div>
                <div className='history'>
                    <div className='history-section'>
                        <TopHistory head='History' time='Last Update 18:24, 22/02/19' />
                    </div>
                    <div className='assessment-section'>
                        <AssessHead text='Create Assessment' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default adminDb;
