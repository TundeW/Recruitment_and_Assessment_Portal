import React, { useState, useEffect, useContext } from 'react';
import './topBar.css';
import josh from '../dashboardIcons/Ellipse.svg';
import { UserContext } from '../../context/UserContext';

const TopBar = (props) => {

    const { user, first_name, last_name, email } = useContext(UserContext);



    // if (props.isActive) {
    //   className += ' menu-active';
    // }

    let userName;
    let userEmail;

    let classtopBar;
    switch(props.style) {
        case "top-bar":
            classtopBar = "top-bar"
            userName = "josh"
            userEmail = "joshe"
            break;
        case "user-top-bar":
            classtopBar = "user-top-bar"
            userName = "user-name"
            userEmail = "user-email"
            break;
        default:
    }

    let classtyle;
    switch (props.color) {
        case "Button":
            classtyle = "Button"
            break;
        case "admin-log":
            classtyle = "Button admin-log"
            break;
        default:
    }
    return (

        <div className={classtopBar}>
        <div className="enyata-profile">
            <img src={props.img}  alt="enyata-profile" />
        </div>
            <p className={userName}>{first_name + " " + last_name}</p>
            <p className={userEmail}>{email}</p>
        </div>
    )
}

export default TopBar
