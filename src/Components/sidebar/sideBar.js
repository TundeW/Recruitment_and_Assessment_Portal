import React from 'react';
import './sideBar.css'
import IconTab from '../iconTab/iconTab'
import josh from '../dashboardIcons/Ellipse.svg';
import dashIcon from '../dashboardIcons/dashIcon.svg';
import createIcon from '../dashboardIcons/createIcon.svg';
import appEntries from '../dashboardIcons/appEntries.svg';
import compAss from '../dashboardIcons/compAss.svg';
import AssHistory from '../dashboardIcons/AssHistory.svg';
import result from '../dashboardIcons/result.svg';
import Rectangle from '../dashboardIcons/Rectangle 8.9.svg';
import TopBar from '../topBar/topBar';


const sideBar = () => {
    return (
        <div>
            <div className='sidebar'>
                <TopBar />
                <div className='tab-list'>
                    <IconTab icon={Rectangle} img={dashIcon} text='Dashboard' link='/admin/home' />
                    <IconTab img={createIcon} text='Create Application' link='/admin/application' />
                    <IconTab img={appEntries} text='Application Entires' />
                    <IconTab img={compAss} text='Compose Assessment' link='/compose/assessment' />
                    <IconTab img={AssHistory} text='Assessment History' />
                    <IconTab img={result} text='Result' />
                </div>
            </div>
        </div>
    )
}

export default sideBar

