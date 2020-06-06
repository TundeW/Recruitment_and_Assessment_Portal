import React, { useState } from 'react';
import FormInput from '../../Components/FormInput/FormInput';
import Button from '../../Components/Button/Button'
import ReactDOM from "react-dom";
import logo from './Enyata.svg';
import logo1 from './enyata logo.svg';
import './Signup.css'
import eyes from '../../Components/mainicons/eyeslogo.svg'

function Signup(props) {
    const [state, setState] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        confirm_password: '',
        errors: {
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
            password: '',
            confirm_password: '',
        },
        submitErrors: ''
    });

    const [passwordShown, setPasswordShown] = useState(false);

    const [loading, setLoading] = useState(false)

    const togglePasswordVisibility = () => {
        setPasswordShown(passwordShown ? false: true);
    }
    const [Shown, setShown] = useState(false);

    const PasswordVisibility = () => {
        setShown(Shown ? false: true);
    }

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
                    value.length < 3
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
            // console.log(state)
            setLoading(true)
            const request = (({ errors, submitErrors, confirm_password, ...o }) => o)(state)
            console.log(request)

            const requestOptions = {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            };

            const url = 'http://localhost:5000/api/v1/auth/signup';

            fetch(url, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        // Here you should have logic to handle invalid creation of a user.
                        // This assumes your Rails API will return a JSON object with a key of
                        // 'message' if there is an error with creating the user, i.e. invalid username
                        setState({
                           ...state, submitErrors: data.message
                        })
                        setLoading(false)
                        console.log(data.message)
                    } else {
                        console.log(data.response)
                        // console.log(data.data.token)
                        // console.log(data.user)
                        props.history.push({
                            pathname: '/signin'
                        })
                    }
                })
                .catch(error => console.log(error));

            // setState({
            //  ...state,
            //  first_name: "",
            //  last_name: "",
            //  email: "",
            //  phone_number: "",
            //  password: "",
            //  confirm_password: "",
            // })
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
                <FormInput label="Password" type={passwordShown ? "text" : "password"} name="password"  value={state.password} change={handleChange} labelColor="label-name"/>
                <div className="eyes" onClick={togglePasswordVisibility}><img src={eyes} alt="toggle-check" /></div>
                <div className="error-message">{errors.password.length > 0 && <span className='error'>{errors.password}</span>}</div>
                </div>
                <div>
                <FormInput label= "Confirm password" type={Shown ? "text" : "password"} name="confirm_password"  value={state.confirm_password} change={handleChange} labelColor="label-name"/>
                <div className="eyes" onClick={PasswordVisibility}><img src={eyes} alt="toggle-check" /></div>
                <div className="error-message">{errors.confirm_password.length > 0 && <span className='error'>{errors.confirm_password}</span>}</div>
                </div>
                </div>
                </form>
                <div className="button">
                <span  onClick= {submitForm}><Button  text="Sign Up" color="Button" load={loading}/></span>
                </div>
                <div className="server-error">{state.submitErrors.length > 0 && <span className='error'>{state.submitErrors}</span>}</div>
                <div className="forgot-password">
                <span>Already have an account?<a href="signin"> Sign In</a></span>
                </div>
                </div>
            </div>
    )
}

export default Signup;
