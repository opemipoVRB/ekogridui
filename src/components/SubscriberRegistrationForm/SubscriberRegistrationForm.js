import React, { useState } from 'react';
import axios from 'axios';
import './SubscriberRegistrationForm.css';
import { API_BASE_URL } from '../../constants/apiContants';
import { withRouter } from "react-router-dom";
import {Button, Card, CardBody, Col, Form, FormGroup, Input, Row} from "reactstrap";



function SubscriberRegistrationForm(props) {
  const [state, setState] = useState({
    "first_name": "",
    "last_name": "",
    "email": "",
    "password1": "",
    "password2": "",
    "address": "",
    "phone_number": "",
    "device": "",
    "successMessage": null
  });
  const handleChange = (e) => {
    const { id, value } = e.target;
    setState(prevState => ({
      ...prevState,
      [id]: value
    }))
  };
  const sendDetailsToServer = () => {
    if (state.email.length && state.password1.length) {
      props.showError(null);
      const payload = {
        "first_name": state.first_name,
        "last_name": state.last_name,
        "email": state.email,
        "password1": state.password1,
        "password2": state.password2,
        "address": state.address,
        "phone_number": state.phone_number,
        "device": state.device
      };
      axios.post(API_BASE_URL + 'rest-auth/subscriber/registration/', payload)
        .then(function (response) {
          if (response.data.code === 201) {
            setState(prevState => ({
              ...prevState,
              'successMessage': 'Registration successful. Redirecting to home page..'
            }));
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

  };
  const redirectToHome = () => {
    props.history.push('/home');
  };
  const redirectToLogin = () => {
    props.history.push('/login');
  };
  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (state.password1 === state.password2) {
      sendDetailsToServer()
    } else {
      props.showError('Passwords do not match');
    }
  };
  return (
    <div>
      <Row className="centered-body">
        <Col className="center-block" md="5">
          <Card className="card-user">
            <CardBody>
              <div className="author">
                <div className="block block-one" />
                <div className="block block-two" />
                <div className="block block-three" />
                <div className="block block-four" />
              </div>
              <Form>
                      <Row>
                                          <Col className="pr-md-1" md="6">
                                            <FormGroup>
                                               <Input
                                                   id="first_name"
                                                   value={state.first_name}
                                                   placeholder="First Name"
                                                   type="text"
                                                   onChange={handleChange}
                                              />
                                            </FormGroup>
                                          </Col>
                                          <Col className="pl-md-1" md="6">
                                            <FormGroup>
                                              <Input
                                                  id="last_name"
                                                  value={state.last_name}
                                                  placeholder="Last Name"
                                                  type="text"
                                                  onChange={handleChange}
                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                       <Row>
                                           <Col className="pl-md-1" md="6">
                                            <FormGroup>
                                              <Input
                                                  id="phone_number"
                                                  value={state.phone_number}
                                                  placeholder="Phone Number"
                                                  type="text"
                                                  onChange={handleChange}
                                              />
                                            </FormGroup>
                                          </Col>
                                          <Col className="pr-md-1" md="6">
                                            <FormGroup>
                                               <Input
                                                    id="email"
                                                    value={state.email}
                                                    placeholder="Email Address"
                                                    type="email"
                                                    aria-describedby="emailHelp"
                                                    onChange={handleChange}
                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                       <Row>
                                          <Col className="pr-md-1" md="6">
                                            <FormGroup>
                                               <Input
                                                   id="password1"
                                                   value={state.password1}
                                                   placeholder="Password"
                                                   type="password"
                                                   onChange={handleChange}
                                              />
                                            </FormGroup>
                                          </Col>
                                          <Col className="pl-md-1" md="6">
                                            <FormGroup>
                                               <Input
                                                   id="password2"
                                                   value={state.password2}
                                                   placeholder="Confirm Password"
                                                   type="password"
                                                   onChange={handleChange}
                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col md="12">
                                            <FormGroup>
                                              <Input
                                                  id="address"
                                                  value={state.address}
                                                  placeholder="Home Address"
                                                  type="text"
                                                  onChange={handleChange}
                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                       <Row>
                                          <Col className="pr-md-2" md="8">
                                            <FormGroup>
                                               <Input
                                                   id="device"
                                                   value={state.device}
                                                   placeholder="Meter Number"
                                                   type="text"
                                                   onChange={handleChange}
                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                        <Row>
                                            <Col className="pr-md-2" md="8">
                                                <Button className="btn-fill" color="primary" type="submit"  onClick={handleSubmitClick}>
                                                    Register
                                               </Button>
                                          </Col>
                                        </Row>


                  
              </Form>

              <div className="alert alert-success mt-2" style={{ display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
              </div>
              <div className="mt-2">
                <span>Already have an account? </span>
                <span className="loginText" onClick={() => redirectToLogin()}>Login here</span>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default withRouter(SubscriberRegistrationForm);




            {/*<Row>*/}
                {/*<Col className="pr-md-1" md="6">*/}
                  {/*<FormGroup>*/}
                  {/*<input type="email"*/}
                          {/*className="form-control"*/}
                          {/*id="email"*/}
                          {/*aria-describedby="emailHelp"*/}
                          {/*placeholder="Enter email"*/}
                          {/*value={state.email}*/}
                          {/*onChange={handleChange}*/}
                        {/*/>*/}
                  {/*</FormGroup>*/}
                {/*</Col>*/}
                {/**/}
              {/*</Row>*/}

                {/*<div className="form-group text-left">*/}
                  {/*<label htmlFor="exampleInputFirstName">First Name</label>*/}
                  {/*<input type="first_name"*/}
                    {/*className="form-control"*/}
                    {/*id="first_name"*/}
                    {/*placeholder="Enter First Name"*/}
                    {/*value={state.first_name}*/}
                    {/*onChange={handleChange}*/}
                  {/*/>*/}
                {/*</div>*/}
                {/*<div className="form-group text-left">*/}
                  {/*<label htmlFor="exampleInputLastName">Last Name</label><input type="last_name"*/}
                    {/*className="form-control"*/}
                    {/*id="last_name"*/}
                    {/*placeholder="Enter Last Name"*/}
                    {/*value={state.last_name}*/}
                    {/*onChange={handleChange}*/}

                  {/*/>*/}
                {/*</div>*/}

                {/*<div className="form-group text-left">*/}
                  {/*<label htmlFor="exampleInputEmail1">Email address</label>*/}
                  {/*<input type="email"*/}
                    {/*className="form-control"*/}
                    {/*id="email"*/}
                    {/*aria-describedby="emailHelp"*/}
                    {/*placeholder="Enter email"*/}
                    {/*value={state.email}*/}
                    {/*onChange={handleChange}*/}
                  {/*/>*/}
                {/*</div>*/}
                {/*<div className="form-group text-left">*/}
                  {/*<label htmlFor="exampleInputPassword1">Password</label>*/}
                  {/*<input type="password"*/}
                    {/*className="form-control"*/}
                    {/*id="password1"*/}
                    {/*placeholder="Password"*/}
                    {/*value={state.password1}*/}
                    {/*onChange={handleChange}*/}
                  {/*/>*/}
                {/*</div>*/}
                {/*<div className="form-group text-left">*/}
                  {/*<label htmlFor="exampleInputPassword1">Confirm Password</label>*/}
                  {/*<input type="password"*/}
                    {/*className="form-control"*/}
                    {/*id="password2"*/}
                    {/*placeholder="Confirm Password"*/}
                    {/*value={state.password2}*/}
                    {/*onChange={handleChange}*/}
                  {/*/>*/}
                {/*</div>*/}
                {/*<div className="form-group text-left">*/}
                  {/*<label htmlFor="exampleInputAddress">House Address</label><input type="address"*/}
                    {/*className="form-control"*/}
                    {/*id="address"*/}
                    {/*placeholder="Enter House Address"*/}
                    {/*value={state.address}*/}
                    {/*onChange={handleChange}*/}
                  {/*/>*/}
                {/*</div>*/}
                {/*<div className="form-group text-left">*/}
                  {/*<label htmlFor="exampleInputLastName">Phone No</label><input type="phonenumber"*/}
                    {/*className="form-control"*/}
                    {/*id="phone_number"*/}
                    {/*placeholder="Enter Phone Number"*/}
                    {/*value={state.phone_number}*/}
                    {/*onChange={handleChange}*/}
                  {/*/>*/}
                {/*</div>*/}
                {/*<div className="form-group text-left">*/}
                  {/*<label htmlFor="exampleInputDevice">Device</label><input type="device"*/}
                    {/*className="form-control"*/}
                    {/*id="device"*/}
                    {/*placeholder="Enter The S/N on your Meter"*/}
                    {/*value={state.device}*/}
                    {/*onChange={handleChange}*/}
                  {/*/>*/}
                {/*</div>*/}