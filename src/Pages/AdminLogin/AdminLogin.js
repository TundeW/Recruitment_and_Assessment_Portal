import React, {useState} from 'react';
import FormInput from '../../Components/FormInput/FormInput';
import Button from '../../Components/Button/Button'
import Enyatalogo from './enyata-white-logo.svg';
import Enyatalogo2 from './enyata.svg'
import './AdminLogin.css'
import background from './background.svg'


function AdminLogin() {
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
        e.preventDefault();
        if(validateForm(state.errors)){
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
        <div className= "login-background">
            <div className="background-grid">
                <div className="admin-form">
                    <div className="input-container">
                    <div className="e-logo">
                    <img src={Enyatalogo} alt="Enyata logo"/>
                    </div>
                    <br/>
                    <div className="e-logo">
                    <img src={Enyatalogo2} alt="Enyata logo" />
                    </div>
                    <FormInput label="Email Address" type='text' name="email"  value={state.email} change={handleChange} color="admin" labelColor="admin-label"/>
                    {errors.email.length > 0 && <span className='error'>{errors.email}</span>}
                    <br />
                    <FormInput label="Password" type='password' name="password"  value={state.password} change={handleChange} color="admin" labelColor="admin-label"/>
                    {errors.password.length > 0 && <span className='error'>{errors.password}</span>}
                    <div className="admin-login-button">
                    <span onClick={submitForm}><Button text="Sign In" color="admin-log"/></span>
                    </div>
                    <p className= "forget-admin-password">Forgot Password?</p>
                    </div>
                </div>
                <div className="background-image">
                    <img src={background} alt="background"/>
                </div>
                <br/>
                <br/>
            </div>
        </div>
    
    )
}

export default AdminLogin;
