import React, {useState} from 'react';
import LoginForm from './components/LoginForm/LoginForm';
import SubscriberRegistrationForm from './components/SubscriberRegistrationForm/SubscriberRegistrationForm';
import StakeholderRegistrationForm from './components/StakeholderRegistrationForm/StakeholderRegistrationForm';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import SubscriberLayout from "layouts/Subscriber/Subscriber.js";
import StakeholderLayout from "layouts/Stakeholder/Stakeholder";
import AlertComponent from './components/AlertComponent/AlertComponent';
import { createBrowserHistory } from "history";

import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";
import HomePage from "./HomePage";
const hist = createBrowserHistory();



function App() {
  const [updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);
  return (
    <Router history={hist}>
    <div className="App">
        {/*<div className="container d-flex align-items-center flex-column">*/}
          <Switch>
              <Route path="/subscriber" render={props => <SubscriberLayout {...props} />} />
              <Route path="/stakeholder" render={props => <StakeholderLayout {...props} />} />
            <Route path="/" exact={true}>
              <HomePage/>
            </Route>
            <Route path="/register/subscriber">
              <SubscriberRegistrationForm showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/register/stakeholder">
                <StakeholderRegistrationForm showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/login">
              <LoginForm showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
          </Switch>
          <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage}/>
        </div>
    {/*</div>*/}
    </Router>
  );
}

export default App;
