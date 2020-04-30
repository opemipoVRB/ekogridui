import React, {useState} from 'react';
import axios from 'axios';
import './SubscriberRegistrationForm.css';
import {API_BASE_URL} from '../../constants/apiContants';
import { withRouter } from "react-router-dom";

function SubscriberRegistrationForm(props) {
    const [state , setState] = useState({
        "first_name": "",
        "last_name": "",
        "email": "",
        "password1": "",
        "password2": "",
        "address": "",
        "phone_number": "",
        "device": "",
        "successMessage":null
    })
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }
    const sendDetailsToServer = () => {
        if(state.email.length && state.password1.length) {
            props.showError(null);
            const payload={
                "first_name": state.first_name,
                "last_name": state.last_name,
                "email": state.email,
                "password1": state.password1,
                "password2": state.password2,
                "address": state.address,
                "phone_number": state.phone_number,
                "device": state.device
              }
            axios.post(API_BASE_URL+'rest-auth/subscriber/registration/', payload)
                .then(function (response) {
                    if(response.data.code === 201){
                        setState(prevState => ({
                            ...prevState,
                            'successMessage' : 'Registration successful. Redirecting to home page..'
                        }))
                        redirectToHome();
                        props.showError(null)
                    } 
                })
                .catch(function (error) {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log("Got this response data", error.response.data);
                        console.log("Got this response status", error.response.status);
                        console.log("Got this response status", error.response.headers);
                        props.showError(error.response.data["device"]);
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
        } else {
            props.showError('Please enter valid username and password')    
        }
        
    }
    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/home');
    }
    const redirectToLogin = () => {
        props.updateTitle('Login')
        props.history.push('/login'); 
    }
    const handleSubmitClick = (e) => {
        e.preventDefault();
        if(state.password1 === state.password2){
            sendDetailsToServer()    
        } else {
            props.showError('Passwords do not match');
        }
    }
    return(
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
        <form>
        <div className="form-group text-left">
          <label htmlFor="exampleInputFirstName">First Name</label>
          <input type="first_name"
            className="form-control"
            id="first_name"
            placeholder="Enter First Name"
            value={state.first_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group text-left">
          <label htmlFor="exampleInputLastName">Last Name</label><input type="last_name"
            className="form-control"
            id="last_name"
            placeholder="Enter Last Name"
            value={state.last_name}
            onChange={handleChange}

          />
        </div>

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
            id="password1"
            placeholder="Password"
            value={state.password1}
            onChange={handleChange}
          />
        </div>
        <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Confirm Password</label>
                    <input type="password" 
                        className="form-control" 
                        id="password2" 
                        placeholder="Confirm Password"
                        value={state.password2}
                        onChange={handleChange} 
                    />
        </div>
        <div className="form-group text-left">
          <label htmlFor="exampleInputAddress">House Address</label><input type="address"
            className="form-control"
            id="address"
            placeholder="Enter House Address"
            value={state.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group text-left">
          <label htmlFor="exampleInputLastName">Phone No</label><input type="phonenumber"
            className="form-control"
            id="phone_number"
            placeholder="Enter Phone Number"
            value={state.phone_number}
            onChange={handleChange}
          />
        </div>
        <div className="form-group text-left">
          <label htmlFor="exampleInputDevice">Device</label><input type="device"
            className="form-control"
            id="device"
            placeholder="Enter The S/N on your Meter"
            value={state.device}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmitClick}
        >
          Register
                </button>
      </form>

            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="mt-2">
                <span>Already have an account? </span>
                <span className="loginText" onClick={() => redirectToLogin()}>Login here</span> 
            </div>
            
        </div>
    )
}

export default withRouter(SubscriberRegistrationForm);