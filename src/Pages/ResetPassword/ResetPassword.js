import React, { useState, useEffect, useContext } from 'react';
import FormInput from '../../Components/FormInput/FormInput';
import Button from '../../Components/Button/Button'
import logo from '../../Components/mainicons/Enyata.svg';
import logo1 from '../../Components/mainicons/enyata logo.svg';
import eyes from '../../Components/mainicons/eyeslogo.svg'


function ResetPassword(props) {
    const [state, setState] = useState({
        password: '',
        confirm_password: '',
        errors: {
            password: '',
            confirm_password: '',
        },
        submitErrors: '',
        submitSuccess: ''
    });
  
    const [passwordShown, setPasswordShown] = useState(false);

    const [loading, setLoading] = useState(false)

    const togglePasswordVisibility = () => {
        setPasswordShown(passwordShown ? false: true);
    }

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
            case 'password':
                errors.password =
                value.length < 3
                ? 'Password must be 3 characters long!'
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
    const { errors } = state;

    const submitForm = (e) => {
        e.preventDefault()
        if(validateForm(state.errors)) {
            setLoading(true)
            const request = (({ errors, submitErrors, ...o }) => o)(state)
            console.log(request)
            const { token } = props.match.params
            console.log(token)

            const requestOptions = {
                method: 'post',
                headers: { 'Content-Type': 'application/json', 'auth': token},
                body: JSON.stringify(request),
            };

            const url = 'http://localhost:5000/api/v1/auth/resetpassword';

                    fetch(url, requestOptions)
                   .then(response => response.json())
                   .then(data => {
                      if (data.message) {
                         // Here you should have logic to handle invalid creation of a user.
                         // This assumes your Rails API will return a JSON object with a key of
                        //  // 'message' if there is an error with creating the user, i.e. invalid username
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
        <div className="background-container">
            <div className="form">
                <div className="enyata-logo">
                    <img src={logo} alt="Enyata logo" />
                </div>
                <div className="enyata-logo2">
                    <img src={logo1} alt="Enyata logo" />
                </div>
                <p className="sign-in-text">Reset Password</p>
                    <div className="form-label">
                        <FormInput label="Password" type={passwordShown ? "text" : "password"} name="password" value={state.password}   change={handleChange} labelColor="label-name"  noValidate />
                        <div className="eyes-signin" onClick={togglePasswordVisibility}><img src={eyes} alt="toggle-check" /></div>
                        {errors.password.length > 0 && <span className='error'>{errors.password}</span>}
                        <br />
                        <FormInput label=" Confirm Password" type= "password" name="confirm_password" value={state.confirm_password} change={handleChange} labelColor="label-name" noValidate />
                        {errors.confirm_password.length > 0 && <span className='error'>{errors.confirm_password}</span>}
                    </div>
                    <div className="submit">
                        <span onClick={submitForm}><Button text="Reset" color="Button" load={loading} /></span>
                    </div>
                    <div className="server-error">{state.submitErrors.length > 0 && <span className='error'>{state.submitErrors}</span>}</div>
                    <div className='server-success'>{state.submitSuccess.length > 0 && <span>{state.submitSuccess}</span>}</div>
            </div>
        </div>
    )

}
export default ResetPassword;
