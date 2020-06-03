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
import logOut from '../dashboardIcons/logout.svg'


const sideBar = (props) => {
    const { selected, history } = props
    const adminLogOut = () =>{
        localStorage.clear()
        history.push({
            pathname: '/admin/login'
        })
    }
    return (
        <div>
            <div className='sidebar'>
                <TopBar style="top-bar" img={josh}/>
                <div className='tab-list'>
                    <IconTab icon={Rectangle} img={dashIcon} text='Dashboard' link='/admin/dashboard' select = {selected}/>
                    <IconTab img={createIcon} text='Create Application' link='/admin/application'  select = {selected}/>
                    <IconTab img={appEntries} text='Application Entries' link='/admin/entries' select = {selected}/>
                    <IconTab img={compAss} text='Compose Assessment' select = {selected}/>
                    <IconTab img={AssHistory} text='Assessment History' link='/assessment/history' select = {selected}/>
                    <IconTab img={result} text='Result' link='/admin/results' select = {selected}/>
                    <br/>
                    <div className='log-out'onClick={adminLogOut} ><IconTab img={logOut} text="Log Out" className="log"/></div>
                </div>
            </div>
        </div>
    )
}

export default sideBar
