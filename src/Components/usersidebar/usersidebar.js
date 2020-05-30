import React from 'react';
import './usersidebar.css';
import TopBar from '../topBar/topBar';
import userProfile from '../dashboardIcons/userprofile.svg';
import Rectangle from '../dashboardIcons/Rectangle 8.9.svg';
import compAss from '../dashboardIcons/compAss.svg'
import logOut from '../dashboardIcons/logout.svg'
import IconTab from '../iconTab/iconTab'
import dashIcon from '../dashboardIcons/dashIcon.svg';

const UserSideBar = () => {
    return(
        <div>
            <div className='sidebar'>
                <TopBar  style="user-top-bar" img={userProfile} name="Jane Doe" email="doe@enyata.com" />
                <div className='tab-list'>
                <IconTab icon={Rectangle} img={dashIcon} text='Dashboard' link='/admin/home' />
                <IconTab img={compAss} text='Assessment' link='/compose/assessment' />
                <br/>
                <IconTab img={logOut} text="Log Out" className="log"/>
                </div>
            </div>
        </div>
    )
}

export default UserSideBar;
