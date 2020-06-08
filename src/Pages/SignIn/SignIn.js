import React, { useState, useEffect, useContext } from 'react';
import FormInput from '../../Components/FormInput/FormInput';
import Button from '../../Components/Button/Button'
import logo from './Enyata.svg';
import logo1 from './enyata logo.svg';
import './SignIn.css'
import { UserContext } from '../../context/UserContext';
import eyes from '../../Components/mainicons/eyeslogo.svg'


function SignIn(props) {
    const [state, setState] = useState({
        email: '',
        password: '',
        errors: {
            email: '',
            password: '',
        },
        submitErrors: ''
    });

    const [passwordShown, setPasswordShown] = useState(false);

    const [loading, setLoading] = useState(false)

    const togglePasswordVisibility = () => {
        setPasswordShown(passwordShown ? false: true);
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
            case 'email':
                errors.email =
                    validEmailRegex.test(value)
                        ? ''
                        : 'Email is not valid!';
                break;
            case 'password':
                errors.password =
                    value.length < 3
                        ? 'Password must be 3 characters long!'
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

    const { updateUser } = useContext(UserContext);


    const submitForm = (e) => {
        e.preventDefault()
        if(validateForm(state.errors)) {
            setLoading(true)
            const request = (({ errors, submitErrors, ...o }) => o)(state)
            // console.log(request)

            const requestOptions = {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            };

            const url = 'http://localhost:5000/api/v1/auth/login';


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
                        localStorage.setItem("token", data.data.token)
                        if (data.user.application) {
                            props.history.push({
                                pathname: '/home'
                            })
                        }else{
                            props.history.push({
                                pathname: '/application/' + data.data.latest_id
                            })
                        }
                    }
                })
                .catch(error => console.log(error));




        // setState({
        //     ...state,
        //     email: "",
        //     password: "",
        // })
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
                        <FormInput label="Password" type={passwordShown ? "text" : "password"} name="password" value={state.password} change={handleChange} labelColor="label-name" noValidate />
                        <div className="eyes-signin" onClick={togglePasswordVisibility}><img src={eyes} alt="toggle-check" /></div>
                        {errors.password.length > 0 && <span className='error'>{errors.password}</span>}
                    </div>
                    <div className="submit">
                        <span onClick={submitForm}><Button text="Sign In" color="Button" load= {loading}/></span>
                    </div>
                    <div className="server-error">{state.submitErrors.length > 0 && <span className='error'>{state.submitErrors}</span>}</div>
                    <div className="f-password">
                        <span>Don’t have an account yet? <a href="/"> Sign Up </a></span>
                    </div>
                </form>
            </div>
        </div>
    )

}
export default SignIn;
