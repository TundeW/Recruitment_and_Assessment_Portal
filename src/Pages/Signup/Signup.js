import React, { useState } from 'react';
import FormInput from '../../Components/FormInput/FormInput';
import Button from '../../Components/Button/Button'
import ReactDOM from "react-dom";
import logo from './Enyata.svg';
import logo1 from './enyata logo.svg';
import './Signup.css'

function Signup() {
    const [state, setState] = useState({
        first_name: null,
        last_name: null,
        email: null,
        phone_number: null,
        password: null,
        confirm_password: null,
        errors: {
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
            password: '',
            confirm_password: '',
        }
    });

    const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

    const validateForm = (errors) => {
         let valid = true;
        Object.values(errors).forEach( // if we have an error string set valid to false 
            (val) => val.length > 0 && (valid = false) 
        );
        return valid; 
    }
        
    const handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let errors = state.errors;

        
        switch (name) {
            case 'first_name':
                errors.first_name =
                    value.length < 3
                        ? 'First name must be 3 characters long!'
                        : '';
                break;
            case 'last_name':
                errors.last_name =
                    value.length < 3
                        ? 'Last name must be 3 characters long! '
                        : '';
                break;
            case 'email':
                errors.email =
                    validEmailRegex.test(value)
                        ? ''
                        : 'Email is not valid!';
                break;
            case 'phone_number':
                errors.phone_number =
                    value.length == 11
                        ? ''
                        : 'Phone Number is not valid!'
                break;
            case 'password':
                errors.password =
                    value.length < 8
                        ? 'Password must be 8 characters long!'
                        : '';
                break;
            case 'confirm_password':
                errors.confirm_password =
                    value != state.password
                        ? 'Password invalid'
                        : '';
                break;
            default:
                break;
        }

        setState({
          ...state, errors, [name]: value
        });
      };
      const { errors} = state;
      

    const submitForm = (e) => {
        e.preventDefault();
        if(validateForm(state.errors)) { 
            console.log(state)
            setState({
             ...state,
             first_name: "",
             last_name: "",
             email: "",
             phone_number: "",
             password: "",
             confirm_password: "",
            })
        }else{ 
            console.log('Invalid Form') }
       
    }

    return (
        <div className ="background">
            <div className = "form-content">
                <div className= "enyata-logo">
                    <img src={logo} alt="Enyata logo"/>
                </div>
                <div className= "enyata-logo2">
                    <img src={logo1} alt="Enyata logo" />
                </div>
                <p className='text'>Applicant Sign Up</p>
                <form>
                <div className="form-input1">
                <div>
                <FormInput label="First Name" type='text' name="first_name"  value={state.first_name} change={handleChange} labelColor="label-name"/>
                {errors.first_name.length > 0 && <span className='error'>{errors.first_name}</span>}
                </div>
                <div>
                <FormInput label="Last Name" type='text' name="last_name"  value={state.last_name} className="right-input" change= {handleChange} labelColor="label-name"/>
                {errors.last_name.length > 0 && <span className='error'>{errors.last_name}</span>}
                </div>
                </div>
                <div className="form-input1">
                <div>
                <FormInput label="Email Address" type='text' name="email"  value={state.email} change={handleChange} labelColor="label-name"/>
                {errors.email.length > 0 && <span className='error'>{errors.email}</span>}
                </div>
                <div>
                <FormInput label="Phone Number" type='number' name="phone_number" value={state.phone_number} change={handleChange} labelColor="label-name"/>
                {errors.phone_number.length > 0 && <span className='error'>{errors.phone_number}</span>}
                </div>
                </div>
                <div className="form-input1">
                <div>
                <FormInput label="Password" type='password' name="password"  value={state.password} change={handleChange} labelColor="label-name"/>
                {errors.password.length > 0 && <span className='error'>{errors.password}</span>}
                </div>
                <div>
                <FormInput label= "Confirm password" type='password' name="confirm_password"  value={state.confirm_password} change={handleChange} labelColor="label-name"/>
                {errors.confirm_password.length > 0 && <span className='error'>{errors.confirm_password}</span>}
                </div>
                </div>
                </form>
                <div className="button">
                <span  onClick= {submitForm}><Button  text="Sign Up" color="Button"/></span>
                </div>
                <div className="forgot-password">
                <span>Already have an account?<a href="signin"> Sign In</a></span>
                </div>
                </div>
            </div>
    )
}

export default Signup;
