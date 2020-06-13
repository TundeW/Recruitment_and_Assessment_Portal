import React, { useState, useEffect, useContext } from 'react';
import FormInput from '../../Components/FormInput/FormInput';
import Button from '../../Components/Button/Button'
import logo from '../../Components/mainicons/Enyata.1.svg';
import logo1 from '../../Components/mainicons/enyatalogo.svg';
import { UserContext } from '../../context/UserContext';
import eyes from '../../Components/mainicons/eyeslogo.svg'
import Loader from '../../Components/Loader/Loader'
import './ForgotPassword.css'

function ForgotPassword(props) {
    const [state, setState] = useState({
        email: '',
        errors: {
            email: '',
        },
        submitErrors: '',
        submitSuccess: ''
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

            const url = 'http://localhost:5000/api/v1/auth/sendpasswordlink';

                    fetch(url, requestOptions)
                   .then(response => response.json())
                   .then(data => {
                      if (data.message) {
                         // Here you should have logic to handle invalid creation of a user.
                         // This assumes your Rails API will return a JSON object with a key of
                         // 'message' if there is an error with creating the user, i.e. invalid username
                           setState({
                               ...state, submitErrors: data.message, submitSuccess: ''
                            })
                            setLoading(false)
                       console.log(data.message)
                     } else {
                         console.log(data.response)
                          console.log(data.data)
                         // console.log(data.user)
                         setState({
                            ...state, submitSuccess: data.response, submitErrors: ''
                         })
                         setLoading(false)
                    }
                })
                 .catch(error => console.log(error));

        }else{
            console.log('Invalid Form')
        }

    }

    return (
        <div className="background">
            <div className="form">
                <div className="enyata-logo">
                    <img src={logo} alt="Enyata logo" />
                </div>
                <div className="enyata-logo2">
                    <img src={logo1} alt="Enyata logo" />
                </div>
                <h3 className="heading">Forgot Password</h3>
                <p className="forgot-password-text">Don't worry, Resetting your password is easy,<br /> just tell us the email you registered with.</p>
                    <div className="form-label">
                        <FormInput label="Email Address" type='text' name="email" value={state.email} change={handleChange} labelColor="label-name"  noValidate />
                        {errors.email.length > 0 && <span className='error'>{errors.email}</span>}
                    </div>
                    <div className="submit">
                        <span onClick={submitForm}><Button text="Send" color="Button" load={loading}/></span>
                    </div>
                    <div className="server-error">{state.submitErrors.length > 0 && <span className='error'>{state.submitErrors}</span>}</div>
                    <div className='server-success'>{state.submitSuccess.length > 0 && <span>{state.submitSuccess}</span>}</div>
            </div>
        </div>
    )

}
export default ForgotPassword;
