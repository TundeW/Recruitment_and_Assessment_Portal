import React, {useState, useEffect} from 'react';
import FormInput from '../../Components/FormInput/FormInput';
import Button from '../../Components/Button/Button'
import logo from './Enyata.svg';
import logo1 from './enyata logo.svg';
import './ApplicationForm.css'
import plusicon from '../../Components/mainicons/plus icon.svg'



function ApplicationForm(props) {
    const [state, setState] = useState({
        file: null,
        first_name: null,
        last_name: null,
        email: null,
        date_of_birth: null,
        address: null,
        university: null,
        course_of_study: null,
        cgpa: null,
        application_id: null,
        errors: {
            file: '',
            first_name: "",
            last_name: "",
            email: "",
            date_of_birth: "",
            address: "",
            university: "",
            course_of_study: "",
            cgpa:"",
        },
        submitErrors: ''
    });

    useEffect(()=>{
        const { id } = props.match.params;
        setState({...state, application_id: id})
        const token = localStorage.getItem('token')
        if(!token){
            props.history.push({
                pathname: '/signin'
            })
        }
    },[])

    const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
    const dateofBirthRegex = RegExp(/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/)

    const validateForm = (errors) => {
        let valid = true;
       Object.values(errors).forEach( // if we have an error string set valid to false
           (val) => val.length > 0 && (valid = false)
       );
       return valid;
   }

   const fileChange = e => {
       e.preventDefault()
       setState({
           ...state,
           file: e.target.files[0]
       })
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
            case 'date_of_birth':
                errors.date_of_birth =
                value.length == ''
                    ? 'Date of Birth is not valid!'
                    : '';
                    // dateofBirthRegex.test(value)
                    //     ? ''
                    //     : 'Date of Birth is not valid!'
                break;
            case 'address':
                errors.address =
                    value.length == ''
                        ? 'Fill in all fields!'
                        : '';
                break;
            case 'university':
                errors.university =
                    value.length == ''
                        ? 'Fill in all fields'
                        : '';
                break;
            case 'course_of_study':
                errors.course_of_study =
                    value.length == ''
                        ? 'Fill in all fields'
                        : '';
                break;
            case 'file':
                errors.file = '';
                break;
            case 'cgpa':
                errors.cgpa =
                    value.length == ''
                        ? 'Fill in all fields'
                        : '';
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
        console.log('submitted')
        if(validateForm(state.errors)) {
            const request = (({ errors, submitErrors, ...o }) => o)(state)
            const token = localStorage.getItem("token")
            var formData = new FormData()

            for (var key in request){
                formData.append(key, request[key])
            }

            const requestOptions = {
                method: 'post',
                headers: {
                    'auth': token
                },
                body: formData,
            };

            const url = 'http://localhost:5000/api/v1/auth/apply';
            console.log('apple')
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
                        console.log(data.message)
                    } else {
                        console.log(data.response)
                        // console.log(data.data.token)
                        // console.log(data.user)
                        props.history.push({
                            pathname: '/home'
                        })

                    }
                })
                .catch(error => console.log(error));
            // console.log(state)
            // setState({
            //  ...state,
            //  file:"",
            //  first_name: "",
            //  last_name: "",
            //  email: "",
            //  date_of_birth: "",
            //  address: "",
            //  university: "",
            //  course_of_study: "",
            //  cgpa:"",
         //})
        }else{
            console.log('Invalid Form')
        }

    }

    return (
        <div className="application-form">
            <div className="application-form-header">
                <div className="enyata-app-logo">
                    <img src={logo} alt="Enyata logo"/>
                </div>
                <div className="enyata-name">
                    <img src={logo1} alt="Enyata logo" />
                </div>
                <h5 className="form-title">Application Form</h5>
            </div>
            <div className="application-form-body">
                <div className="upload-document">
                    <div className='upload-file'>
                    <input type="file" id="file" name= "file"  onChange={fileChange}/>
                    <div className="file-text-application"><label for="file" >Upload CV</label></div>
                    <div className="plusicon-application"><img src = {plusicon} alt="plus-icon" /></div>
                    <div className="file-name">{state.file ? state.file.name: ""}</div>
                    </div>
                </div>
                <div className="application-form-input">
                <div>
                    <FormInput label="First Name" type='text' name="first_name" value={state.first_name} change={handleChange} color='application' labelColor="label-name" required="required"/>
                    {errors.first_name.length > 0 && <span className='error'>{errors.first_name}</span>}
                </div>
                <div>
                    <FormInput label="Last Name" type='text' name="last_name" value={state.last_name} change={handleChange} color='application' labelColor="label-name" required="required"/>
                    {errors.last_name.length > 0 && <span className='error'>{errors.last_name}</span>}
                </div>
                </div>
                <div className="application-form-input">
                <div>
                    <FormInput label="Email" type='text'  name="email" value={state.email} change={handleChange} color='application' labelColor="label-name" required="required"/>
                    {errors.email.length > 0 && <span className='error'>{errors.email}</span>}
                </div>
                <div>
                    <FormInput label="Date of Birth" type='date' name="date_of_birth" value={state.date_of_birth} change={handleChange} placeholder= "dd/mm/yyyy" color='application' labelColor="label-name" required="required"/>
                    {errors.date_of_birth.length > 0 && <span className='error'>{errors.date_of_birth}</span>}
                </div>
                </div>
                <div className="application-form-input">
                <div>
                    <FormInput label="Address" type='text'name="address" value={state.address} change={handleChange} color='application' labelColor="label-name" required="required"/>
                    {errors.address.length > 0 && <span className='error'>{errors.address}</span>}
                </div>
                <div>
                    <FormInput label= "University" type='text' name="university" value={state.university} change={handleChange} color='application' labelColor="label-name" required="required"/>
                    {errors.university.length > 0 && <span className='error'>{errors.university}</span>}
                </div>
                </div>

                <div className="application-form-input">
                <div>
                    <FormInput label="Course of Study" type='text'name="course_of_study" value={state.course_of_study} change={handleChange} color='application' labelColor="label-name" required="required"/>
                    {errors.course_of_study.length > 0 && <span className='error'>{errors.course_of_study}</span>}
                </div>
                <div>
                    <FormInput label= "CGPA" type='number' name="cgpa" value={state.cgpa} change={handleChange} color='application' labelColor="label-name" required="required"/>
                    {errors.cgpa.length > 0 && <span className='error'>{errors.cgpa}</span>}
                </div>
                </div>
                <div className="server-error">{state.submitErrors.length > 0 && <span className='error'>{state.submitErrors}</span>}</div>
                <div className="submit-button">
                    <span onClick= {submitForm}><Button text="Submit" color="Button"/></span>
                </div>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
        </div>
    )
}

export default ApplicationForm;
