import React from 'react';
import './Button.css'

function Button(props) {
    let classtyle; 
    switch (props.color) {
        case "Button":
            classtyle = "Button"
            break;
        case "admin-log":
            classtyle = "Button admin-log"
            break;
        case "assessment-button":
            classtyle = "Button assessment-button"
            break;
        case "finish-button":
            classtyle = "Button finish-button"
            break;
        default:
    }
    return (
        <div>
            <button className={ classtyle } type="submit">{props.text}</button>
        </div>
    )
}

export default Button;
