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
import Button from '../../Components/Button/Button'
import UserSideBar from '../../Components/usersidebar/usersidebar'


const successPage = (props) => {
    const goToHome=()=>{
        props.history.push({
            pathname: '/home'
        })
    }
    return (
        <div className='success'>
            <div className='side'><UserSideBar selected='Assessment' history={props.history}/></div>
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

                <div className='successful'>
                    <SuccessMsg icon={conffeti}
                     text='We have received your assessment test, we will get back to you soon. Best of luck' color=""
                     />
                    <span onClick={goToHome}><Button text= "Home" color="success-button" /></span>
                </div>
            </div>
        </div>
    )
}

export default successPage
