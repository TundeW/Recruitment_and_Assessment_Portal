import React,{useState} from 'react';
import FormInput from '../../Components/FormInput/FormInput';
import Button from '../../Components/Button/Button'
import './AdminApplication.css'
import SideBar from '../../Components/sidebar/sideBar'

function AdminApplication() {
    const [state, setState] = useState({
        file: "",
        link: "",
        application_closure_date: null,
        batch_id: null,
        instructions: null,
        errors: {
            application_closure_date: "",
            batch_id: "",
            instructions: "",
        }
    });

    const dateRegex = RegExp(/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/)

    const handleChange = e => {
        e.preventDefault()
        const { name, value } = e.target;
        let errors = state.errors;

        switch(name) {
            case 'application_closure_date':
                errors.application_closure_date =
                    dateRegex.test(value)
                        ? ''
                        : 'Invalid Date!';
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

    const submitForm = (e) => {
        e.preventDefault();
       console.log(state)
       setState({
        ...state,
        file:"",
        link: "",
        application_closure_date: "",
        batch_id: "",
        instructions: "",
        
    })
    }

    return (
        <div>
           <SideBar/>
           <br />
           <div className="admin-application-form">
           <div>
               <h2>Create Application</h2> 
               <div className="admin-application-input">
                       <div className="upload-document-file">
                       <input type="file" id="file"/>
                        <span class="btn" name="file" value={state.file} change={handleChange}>Choose file</span>
                         </div> 
                    <FormInput label="Link" type='text' name="link" value={state.link} labelColor="label-name"  color="admin-application-forminput"/>
               </div>
               <div className="admin-application-input">
               <div>
                   <FormInput label="Application closure date" type='date' name="application_closure_date" value={state.application_closure_date} change={handleChange} labelColor="application-label"  color="admin-application-forminput"/>
                   {errors.application_closure_date.length > 0 && <span className='error'>{errors.application_closure_date}</span>}
                </div>
                <div>
                   <FormInput label="Batch ID" type='text' name="batch_id" value={state.batch_id} change={handleChange} labelColor="application-label" color="admin-application-forminput"/>
                   {errors.batch_id.length > 0 && <span className='error'>{errors.batch_id}</span>}
                </div>
               </div>
               <div>
                   <p className="admin-instruction">Instructions</p>
                   <textarea className="instruction-area" name="instructions" value= {state.instructions} onChange={handleChange} ></textarea>
                   <br />
                   {errors.instructions.length > 0 && <span className='error'>{errors.instructions}</span>}
               </div>
               <div className="admin-application-button">
               <span onClick={ submitForm }><Button text="Submit" color="Button"/></span>
               </div>
               </div>
           </div>
        </div>
    )
}

export default AdminApplication;
