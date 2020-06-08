import React, {useState, useEffect} from 'react';
import FormInput from '../../Components/FormInput/FormInput';
import Button from '../../Components/Button/Button'
import './AdminApplication.css'
import SideBar from '../../Components/sidebar/sideBar'
import plusicon from '../../Components/mainicons/plus icon.svg'


function AdminApplication(props) {
    const [state, setState] = useState({
        file: "",
        deadline: null,
        batch_id: null,
        instructions: null,
        errors: {
            application_closure_date: "",
            batch_id: "",
            instructions: "",
        },
        submitErrors: ''
    });
    const [link, setLink] = useState('')

    const [loading, setLoading] = useState(false)


    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(!token){
            props.history.push({
                pathname: '/admin/login'
            })
        }
        const id = state.batch_id
        const appLink = id ? `http://localhost:3000/application/${id}` : ''
        setLink(appLink)
    }, [state])

    const dateRegex = RegExp(/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/)

    const handleChange = e => {
        e.preventDefault()
        const { name, value } = e.target;
        let errors = state.errors;

        switch(name) {
            case 'application_closure_date':
                errors.application_closure_date =
                    value.length == ''
                        ? 'Invalid Date!'
                        : '';
                    // dateRegex.test(value)
                    //     ? ''
                    //     : 'Invalid Date!';
                break;
            case 'batch_id':
                errors.batch_id =
                    value.length == ''
                        ? 'Fill in all fields!'
                        : '';
                break;
            case 'instructions':
                errors.instructions =
                    value.length == ''
                        ? 'Fill in all fields!'
                        : '';
            default:
                break;
        }
        setState({
          ...state, errors, [name]: value
        });
      };

    const { errors } = state;

    const fileChange = e => {
        e.preventDefault()
        setState({
            ...state,
            file: e.target.files[0]
        })
    }

    const submitForm = (e) => {
        e.preventDefault();
        setLoading(true)
        const data = (({ errors, submitErrors, ...o }) => o)(state)
        const request = {...data, link}
        console.log(request)
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

        const url = 'http://localhost:5000/api/v1/auth/admin/application/create';
        console.log('apple')
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    // Here you should have logic to handle invalid creation of a user.
                    // This assumes your Rails API will return a JSON object with a key of
                    // 'message' if there is an error with creating the user, i.e. invalid username
                    console.log(data.message)
                    setState({
                        ...state, submitErrors: data.message
                     })
                    setLoading(false)
                } else {
                    console.log(data.response)
                    // console.log(data.data.token)
                    // console.log(data.user)
                    props.history.push({
                        pathname: '/admin/dashboard'
                    })

                }
            })
            .catch(error => console.log(error));

    //    setState({
    //     ...state,
    //     file:"",
    //     link: "",
    //     application_closure_date: "",
    //     batch_id: "",
    //     instructions: "",
    //
    // })
    }

    return (
        <div>
           <SideBar selected='Create Application' history={props.history}/>
           <br />
           <div className="admin-application-form">
           <div>
               <h2>Create Application</h2>
               <div className="admin-application-input">
                       <div className="upload-document-file">
                       <input type="file" id="file" name= "file"  onChange={fileChange}/>
                       <div className="file-text"><label for="file" >Choose file</label></div>
                       <div className="plusicon"><img src = {plusicon} alt="plus-icon" /></div>
                        <div>{state.file ? state.file.name: ""}</div>
                         </div>
                    <FormInput label="Link" type='text' name="link" value={state.batch_id ? `http://localhost:3000/application/${state.batch_id}` : ''} labelColor="label-name"  color="admin-application-forminput"/>
               </div>
               <div className="admin-application-input">
               <div>
                   <FormInput label="Application closure date" type='date' name="deadline" value={state.application_closure_date} change={handleChange} labelColor="application-label"  color="admin-application-forminput"/>
                   {errors.application_closure_date.length > 0 && <span className='error'>{errors.application_closure_date}</span>}
                </div>
                <div>
                   <FormInput label="Batch ID" type='number' name="batch_id" value={state.batch_id} change={handleChange} labelColor="application-label" color="admin-application-forminput"/>
                   {errors.batch_id.length > 0 && <span className='error'>{errors.batch_id}</span>}
                </div>
               </div>
               <div>
                   <p className="admin-instruction">Instructions</p>
                   <textarea className="instruction-area" name="instructions" value= {state.instructions} onChange={handleChange} ></textarea>
                   <br />
                   {errors.instructions.length > 0 && <span className='error'>{errors.instructions}</span>}
               </div>
               <div className="admin-server-error">{state.submitErrors.length > 0 && <span className='error'>{state.submitErrors}</span>}</div>
               <div className="admin-application-button">
               <span onClick={ submitForm }><Button text="Submit" color="Button" load= {loading}/></span>
               </div>
               </div>
           </div>
        </div>
    )
}

export default AdminApplication;
