import React from 'react';
import './successPage.css';
import SideBar from '../../Components/sidebar/sideBar';
import IconLevel from '../../Components/iconLevel/iconLevel';
import navicon from '../../Components/mainicons/navicon.svg';
import conffeti from '../../Components/mainicons/confetti.svg';
// import Button from '../../Components/button/button';
import Timer from '../../Components/timer/timer';
import TakeAssment from '../../Components/takeAssmnt/takeAssment';
import SuccessMsg from '../../Components/successMsg/successMsg';

const successPage = () => {
    return (
        <div className='success'>
            <div className='side'><SideBar /></div>
            <div className='assess-success'>
                <div className='take-assmnt'>
                    <div>
                        <TakeAssment text='Take Assessment' text2='Thank you!' />
                        {/* <p className='take'>Take Assessment</p>
                        <p className='thanks'>Thank you!</p> */}
                    </div>
                    <div>
                        <Timer text='Timer' text2='min' text3='sec' num='23' num2='043' />
                    </div>
                </div>
                <div className='nav-bar'>
                    <IconLevel navicon={navicon} />
                </div>
                <div className='successful'>
                    <SuccessMsg icon={conffeti} 
                     text='We have received your assessment test, we will get back to you soon. Best of luck'
                     />
                    {/* <img src={conffeti} />
                    <p classNamec='success-msg'>We have received your assessment test, we will get back to you soon.<br /> Best of luck</p>
                    <Button text='Home' /> */}
                </div>
            </div>
        </div>
    )
}

export default successPage
