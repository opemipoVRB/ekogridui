import  {AUTH_START, AUTH_SUCCESS, AUTH_FAIL, AUTH_LOGOUT} from "./actionTypes";
import axios from "axios";
import {API_BASE_URL} from "../../constants/apiContants";
import Cookies from 'js-cookie';


export const authStart = ()=>{
    return{

        type: AUTH_START

    }
};


export const authSuccess = token => {
    return{
        type: AUTH_SUCCESS,
        token: token
    }
};


export const authFail = error => {
    return{
        type: AUTH_FAIL,
        error: error
    }
};

export const logout = ()=>{
  Cookies.remove('token');
  Cookies.remove('expirationDate');
  Cookies.remove('userType');
  return{
      type: AUTH_LOGOUT

  }
};
export const checkAuthTimeout = expirationTime =>{
    return dispatch => {
        setTimeout(()=> {
            dispatch(logout());
        }, expirationTime * 1000)
    }
};





export const authLogin = (email, password, props) => {
    return dispatch =>{
            dispatch(authStart());
            const payload = {
                "email": email,
                "password": password,
            };
            axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
            axios.defaults.xsrfCookieName = "csrftoken";
            axios.defaults.withCredentials = true;
            axios.post(API_BASE_URL + 'rest-auth/gridtracker/login/', payload)
                .then(function (response) {
                    if (response.data.code === 200) {
                        // setState(prevState => ({
                        //     ...prevState,
                        //     'successMessage': 'Login successful. Redirecting to home page..'
                        // }));
                        props.showError(null);
                        const token = response.data.key;
                        const expirationDate = new Date(new Date().getTime() + 3600);
                        const userType = response.data.user_type
                        Cookies.set('token', token);
                        Cookies.set('expirationDate', expirationDate);
                        Cookies.set('userType', userType );
                        dispatch(authSuccess(token));
                        dispatch(checkAuthTimeout(3600));
                }
                console.log("Response Data ", response.data)
            })
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    // console.log("Got this response data", error.response.data);
                    // console.log("Got this response status", error.response.status);
                    // console.log("Got this response status", error.response.headers);
                    if (error.response.data["non_field_errors"]) {
                        props.showError(error.response.data["non_field_errors"]);
                        // console.log(error.response.data["non_field_errors"]);
                    }
                    else if (error.response.data["email"]) {
                        props.showError(error.response.data["email"]);
                        // console.log(error.response.data["email"]);

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
        }
};


export const authCheckState = ()=>{
  return dispatch =>{
      const token = Cookies.get('token');
      if (token === undefined){
          dispatch(logout());

      }
      else {
          const expirationDate = new Date(Cookies.get('expirationDate'));
          if (expirationDate <= new Date()){
              dispatch(logout());
          }
          else{
              dispatch(authSuccess(token));
              dispatch(checkAuthTimeout((expirationDate.getTime()- new Date().getTime())/ 1000))
          }
      }
  }
};


