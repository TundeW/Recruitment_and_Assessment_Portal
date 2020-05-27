import React from 'react';
import './FormInput.css'

function FormInput(props) {
    let classes; 
    switch (props.color) {
        case "admin":
            classes = "input-box admin"
            break;
        case "application":
            classes = "input-box application"
            break;
        case "admin-application-forminput":
            classes = "input-box admin-application-forminput"
            break;
        case "instruction-box":
            classes = "input-box instruction-box"
            break;
        default:
            classes = "input-box user"
    }
    let classLabel; 
    switch (props.labelColor) {
        case "label-name":
            classLabel = "label-name"
            break;
        case "admin-label":
            classLabel = "label-name admin-label"
            break;
        case "application-label":
            classLabel = "label-name application-label"
            break;
        default:
    }
    return (
        <div>
            <form onSubmit={props.onSubmit}>
            <label className={ classLabel}>{props.label}</label> 
                <br />
            <input className= { classes } value={props.value} name={props.name} onChange={props.change} type= {props.type} placeholder ={props.placeholder} required={props.required} />
            </form>
        </div>
        
    )
}

export default FormInput;
