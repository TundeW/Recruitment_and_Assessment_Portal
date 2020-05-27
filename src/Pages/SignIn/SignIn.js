import React, { useState } from 'react';
import FormInput from '../../Components/FormInput/FormInput';
import Button from '../../Components/Button/Button'
import logo from './Enyata.svg';
import logo1 from './enyata logo.svg';
import './SignIn.css'

function SignIn() {
    const [state, setState] = useState({
        email: null,
        password: null,
        errors: {
            email: '',
            password: '',
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
            case 'email':
                errors.email =
                    validEmailRegex.test(value)
                        ? ''
                        : 'Email is not valid!';
                break;
            case 'password':
                errors.password =
                    value.length < 8
                        ? 'Password must be 8 characters long!'
                        : '';
                break;
            default:
                break;
        }
        setState({
            ...state, errors, [name]: value
        });
    };
    const { errors } = state;


    const submitForm = (e) => {
        e.preventDefault()
        if(validateForm(state.errors)) {
            console.log(state)
        setState({
            ...state,
            email: "",
            password: "",
        })
        }else{
            console.log('Invalid Form')
        }
        
    }

    return (
        <div className="background-container">
            <div className="form">
                <div className="enyata-logo">
                    <img src={logo} alt="Enyata logo" />
                </div>
                <div className="enyata-logo2">
                    <img src={logo1} alt="Enyata logo" />
                </div>
                <p className="sign-in-text">Applicant Log In</p>
                <form>
                    <div className="form-label">
                        <FormInput label="Email Address" type='text' name="email" value={state.email} change={handleChange} labelColor="label-name"  noValidate />
                        {errors.email.length > 0 && <span className='error'>{errors.email}</span>}
                        <br />
                        <FormInput label="Password" type='password' name="password" value={state.password} change={handleChange} labelColor="label-name" noValidate />
                        {errors.password.length > 0 && <span className='error'>{errors.password}</span>}
                    </div>
                    <div className="submit-button">
                        <span onClick={submitForm}><Button text="Sign In" color="Button" /></span>
                    </div>
                    <div className="f-password">
                        <span>Don’t have an account yet? <a href="/"> Sign Up </a></span>
                        <span className="forget-two">Forgot Password?</span>
                    </div>
                </form>
            </div>
        </div>
    )

}
export default SignIn;
