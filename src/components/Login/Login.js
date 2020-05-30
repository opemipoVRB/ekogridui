import React, { useState } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { authLogin } from "../../store/actions/auth";

import "../AccountManagement/AccountManagement.css"
import { Card, CardBody, Col, FormGroup, Row } from "reactstrap";


function Login(props) {
    const [state, setState] = useState({
        email: "",
        password: "",
        successMessage: null
    });
    const handleChange = (e) => {
        const { id, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        props.onAuth(state.email, state.password, props);



    };


    const redirectToStakeholderRegister = () => {
        props.history.push('/register/stakeholder');
    };
    const redirectToSubscriberRegister = () => {
        props.history.push('/register/subscriber');
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

                            {
                                props.loading ?
                                    <h1>Loading....</h1>
                                    :
                                    <form>
                                        <Col className="pr-md-1" md="10">
                                            <FormGroup>
                                                <label htmlFor="exampleInputEmail1">Email Address</label>
                                                <input type="email"
                                                    className="form-control"
                                                    id="email"
                                                    aria-describedby="emailHelp"
                                                    placeholder="Enter email"
                                                    value={state.email}
                                                    onChange={handleChange}
                                                />
                                                <small id="emailHelp" className="form-text text-muted">

                                                </small>
                                            </FormGroup>
                                        </Col>
                                        <Col className="pr-md-1" md="10">
                                            <FormGroup>
                                                <label htmlFor="exampleInputPassword1">Password </label>
                                                <input type="password"
                                                    className="form-control"
                                                    id="password"
                                                    placeholder="Password"
                                                    value={state.password}
                                                    onChange={handleChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <div className="form-check">
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            onClick={handleSubmitClick}
                                        >Login
                        </button>
                                    </form>
                            }
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

                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}


// export default withRouter(Login);
const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, props) => dispatch(authLogin(email, password, props))
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));