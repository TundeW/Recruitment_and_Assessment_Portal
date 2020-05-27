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
import adminDB from './Pages/adminDB/adminDb'
import userDB from './Pages/userDB/userDb'
import AssessmentHistoryTable from './Components/AssessmentHistoryTable/AssessmentHistoryTable';




function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <Switch>
    <Route exact path = '/' component={Signup} />
    <Route exact path = '/signin' component={SignIn} />
    <Route exact path = '/application' component={ApplicationForm} />
    <Route exact path = '/admin/login' component={AdminLogin} />
    <Route exact path = '/admin/application' component={AdminApplication}/>
    <Route exact path = '/compose/assessment' component={ComposeAssessment} />
    <Route exact path = '/assessment/history' component={AssessmentHistory} />
    <Route exact path = '/success/page' component={successPage} />
    <Route exact path = '/admin/dashboard' component={adminDB} />
    <Route exact path = '/table' component={AssessmentHistoryTable} />
    <Route exact path = '/user/dashboard' component={userDB} />
   </Switch>
   </BrowserRouter>
  </div>
  );
}

export default App;
