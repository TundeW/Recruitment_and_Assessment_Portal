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
        case "success-button":
            classtyle = "Button success-button"
            break;
        default:
    }
    return (
        <div>
            <button className={ classtyle } type="submit" disabled={props.load}>
            {props.text}
            {props.load && <i className='fa fa-refresh fa-spin'></i>}
            </button>
        </div>
    )
}

export default Button;
