import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';
import { API_BASE_URL } from '../../constants/apiContants';
import { withRouter } from "react-router-dom";
import Cookies from 'js-cookie';


function LoginForm(props) {
    const [state, setState] = useState({
        email: "",
        password: "",
        successMessage: null
    });
    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        const payload = {
            "email": state.email,
            "password": state.password,
        };
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios.defaults.xsrfCookieName = "csrftoken";
        axios.defaults.withCredentials = true;
        axios.post(API_BASE_URL + 'rest-auth/gridtracker/login/', payload)
            .then(function (response) {
                if (response.data.code === 200) {
                    setState(prevState => ({
                        ...prevState,
                        'successMessage': 'Login successful. Redirecting to home page..'
                    }))
                    console.log("Response Data ", response.data);
                    Cookies.set('user_type',response.data.user_type);
                    if (response.data.user_type === 1) {
                        redirectToSubscriberDashboard();
                    }
                    else if (response.data.user_type === 2) {
                        redirectToStakeholderDashboard();
                    }


                    props.showError(null)
                }
                console.log("Response Data ", response.data)
            })
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("Got this response data", error.response.data);
                    console.log("Got this response status", error.response.status);
                    console.log("Got this response status", error.response.headers);
                    if (error.response.data["non_field_errors"]) {
                        props.showError(error.response.data["non_field_errors"]);
                    }
                    else if (error.response.data["email"]) {
                        props.showError(error.response.data["email"]);

                    }

                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
            });
    };
    const redirectToSubscriberDashboard = () => {
        // props.updateTitle('Subscriber Dashboard');
        props.history.push('/subscriber/dashboard');
    };
    const redirectToStakeholderDashboard = () => {
        // props.updateTitle('Stakeholder Dashboard');
        props.history.push('/stakeholder/dashboard');
    };
    const redirectToStakeholderRegister = () => {
        // props.updateTitle('Register');
        props.history.push('/register/stakeholder');
    }
    const redirectToSubscriberRegister = () => {
        // props.updateTitle('Register');
        props.history.push('/register/subscriber');
    }
    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email"
                        className="form-control"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        value={state.email}
                        onChange={handleChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        value={state.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-check">
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >Submit</button>
            </form>
            <div className="alert alert-success mt-2" style={{ display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="registerMessage">
                <span>Don't have an account? </span>
                <span className="loginText" onClick={() => redirectToSubscriberRegister()}>Register as Subscriber</span>
                <br />
                <span>Want to become a distribution company? </span>
                <span className="loginText" onClick={() => redirectToStakeholderRegister()}>Register as Distribution Company</span>
            </div>
        </div>
    )
}

export default withRouter(LoginForm);
