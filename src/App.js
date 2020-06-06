import React from 'react';
import './App.css';
import Signup from './Pages/Signup/Signup'
import SignIn from './Pages/SignIn/SignIn'
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import ApplicationForm from './Pages/ApplicationForm/ApplicationForm'
import AdminLogin from './Pages/AdminLogin/AdminLogin';
import AdminApplication from './Pages/AdminApplication/AdminApplication'
import ComposeAssessment from './Pages/ComposeAssessment/ComposeAssessment';
import AssessmentHistory from './Pages/AssessmentHistory/AssessmentHistory'
import successPage from './Pages/successPage/successPage'
import AdminDB from './Pages/adminDB/adminDb'
import userDB from './Pages/userDB/userDb'
import UserContextProvider from './context/UserContext';
import BatchPage from './Pages/Batchies/BatchPage';
import EntriesResult from './Pages/EntriesResult/entriesResult';
import Example from './Pages/userDB/example'
import UserAssessment from './Pages/UserAssessment/UserAssessment';
import TakeAssessment from './Pages/TakeAssessment/takeAssessment';
// import 'bootstrap/dist/css/bootstrap.min.css'



function App() {
  return (
    <div className="App">
    <UserContextProvider>
    <BrowserRouter>
    <Switch>
    <Route exact path = '/example' component={Example} />
    <Route exact path = '/' component={Signup} />
    <Route exact path = '/signin' component={SignIn} />
    <Route exact path = '/application/:id' component={ApplicationForm} />
    <Route exact path = '/admin/login' component={AdminLogin} />
    <Route exact path = '/admin/application' component={AdminApplication}/>
    <Route exact path = '/compose/assessment/:id' component={ComposeAssessment} />
    <Route exact path = '/assessment/history' component={AssessmentHistory} />
    <Route exact path = '/success/page' component={successPage} />
    <Route exact path = '/admin/dashboard' component={AdminDB} />
    <Route exact path = '/home' component = {userDB} />
    <Route exact path='/admin/entries' component={BatchPage} />
    <Route exact path='/admin/results' component={EntriesResult} />
    <Route exact path='/user/assessment' component={UserAssessment} />
    <Route exact path='/assessment/start' component={TakeAssessment} />
   </Switch>
   </BrowserRouter>
   </UserContextProvider>
  </div>
  );
}

export default App;
