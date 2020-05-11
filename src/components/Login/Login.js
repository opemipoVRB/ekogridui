import React, {useState} from 'react';
import './Login.css';
import { withRouter } from "react-router-dom";
import {connect} from 'react-redux';
import {authLogin} from "../../store/actions/auth";
import Cookies from 'js-cookie'



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
        props.onAuth(state.email,state.password, props);



    };


    const redirectToStakeholderRegister = () => {
        props.history.push('/register/stakeholder');
    };
    const redirectToSubscriberRegister = () => {
        props.history.push('/register/subscriber');
    };


    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">


            {
                props.loading ?
                    <h1>Loading....</h1>
                    :
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
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with
                                anyone else.
                            </small>
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
                        >Submit
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
        </div>
    )
}


// export default withRouter(Login);
const mapStateToProps = (state) => {
  return{
      loading:state.loading,
      error: state.error
  }
};

const mapDispatchToProps = dispatch =>{
    return{
        onAuth:(email, password, props) => dispatch(authLogin(email, password, props))
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));