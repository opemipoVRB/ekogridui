/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import {register} from "./serviceWorker";
import reducer from './store/reducers/auth';
import {compose, createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import Provider from "react-redux/es/components/Provider";
import App from "./App";

const composeEnhances= window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__|| compose;

const store = createStore(reducer, composeEnhances(
    applyMiddleware(thunk)
));

const app = (
    <Provider store={store}>
        <App />
    </Provider>

);


ReactDOM.render(app, document.getElementById("root"));
register();

