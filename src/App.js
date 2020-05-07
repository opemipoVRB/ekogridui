import React, {useEffect, useState} from "react";
import Login from "./components/Login/Login";
import SubscriberRegistrationForm from "./components/SubscriberRegistrationForm/SubscriberRegistrationForm";
import StakeholderRegistrationForm from "./components/StakeholderRegistrationForm/StakeholderRegistrationForm";
import {Router, Switch, Route, Redirect,} from "react-router-dom";
import SubscriberLayout from "layouts/Subscriber/Subscriber.js";
import StakeholderLayout from "layouts/Stakeholder/Stakeholder";
import AlertComponent from "./components/AlertComponent/AlertComponent";
import { createBrowserHistory } from "history";

import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";
import HomePage from "./HomePage";
import {authCheckState} from "./store/actions/auth";
import Cookies from 'js-cookie';
import {applyMiddleware as dispatch} from "redux";
import NotFoundPage from "./NotFoundPage";

const hist = createBrowserHistory();


function App() {
  const [errorMessage, updateErrorMessage] = useState(null);
  const token = Cookies.get('token');
  const userType = Cookies.get('userType');
  const isAuthenticated =(token !== null && token !== undefined);

  // useEffect(()=>{
  //     dispatch(authCheckState());
  //
  //
  //   });


        return (
            <Router history={hist}>
                <div className="App">
                    <Switch>
                        <Route  path="/subscriber" render={props =>  (isAuthenticated && userType ==="1") ? <SubscriberLayout {...props} />
                        : <Redirect to="/login"/>
                        }
                        />
                        <Route  path="/stakeholder" render={props =>    (isAuthenticated && userType ==="2") ? <StakeholderLayout {...props} />
                        : <Redirect to="/login"/>
                        }
                        />
                        <Route path="/" exact={true}>
                            <HomePage/>
                        </Route>
                        <Route path="/register/subscriber">
                          <SubscriberRegistrationForm showError={updateErrorMessage}/>
                        </Route>
                        <Route path="/register/stakeholder">
                            <StakeholderRegistrationForm showError={updateErrorMessage} />
                        </Route>
                        <Route path="/login">
                          <Login  showError={updateErrorMessage}/>
                        </Route>
                         <Route path="*" component={NotFoundPage} />
                    </Switch>
          <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage}/>
        </div>
    </Router>
  );
}


export default App;





