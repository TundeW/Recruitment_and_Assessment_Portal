import React from 'react';
import './topBar.css';
import josh from '../dashboardIcons/Ellipse.svg';

const topBar = (props) => {

    let className = 'top-bar';
    // if (props.isActive) {
    //   className += ' menu-active';
    // }

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
        <div className={className}>
        <div className="enyata-profile">
            <img src={josh}  alt="enyata-profile" />
        </div>
            <p className='josh'>Josh Doe</p>
            <p className='joshe'>j.doe@enyata.com</p>
        </div>
    )
}

export default topBar
