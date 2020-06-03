import React from 'react';
import './usersidebar.css';
import TopBar from '../topBar/topBar';
import userProfile from '../dashboardIcons/userprofile.svg';
import Rectangle from '../dashboardIcons/Rectangle 8.9.svg';
import compAss from '../dashboardIcons/compAss.svg'
import logOut from '../dashboardIcons/logout.svg'
import IconTab from '../iconTab/iconTab'
import dashIcon from '../dashboardIcons/dashIcon.svg';

const UserSideBar = (props) => {
    const { selected, history } = props
    const userLogOut = () =>{
        localStorage.clear()
        history.push({
            pathname: '/signin'
        })
    }
    return(
        <div>
            <div className='sidebar'>
                <TopBar  style="user-top-bar" img={userProfile} name="Jane Doe" email="doe@enyata.com" />
                <div className='tab-list'>
                <IconTab icon={Rectangle} img={dashIcon} text='Dashboard' link='/admin/home' select = {selected}/>
                <IconTab img={compAss} text='Assessment' link='/assessment/start' select = {selected}/>
                <br/>
                <div className='log-out' onClick={userLogOut}><IconTab img={logOut} text="Log Out" className="log"/></div>
                </div>
            </div>
        </div>
    )
}

export default UserSideBar;
