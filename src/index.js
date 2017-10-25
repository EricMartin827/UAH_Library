/* NPM imports */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import promise from "redux-promise";

/* CSS Imports */
import "./../style/style.css"

/* Client Applciation Imports */
import Routes from "./Router.js";
import reducers from "./reducers";

const store = applyMiddleware(promise, thunk)(createStore);

const MainApp = () => {
    return (
        <Provider store={store(reducers)}>
            <Routes />
        </Provider>
    );
};

ReactDOM.render(
    <MainApp />,
    document.getElementById("container")
);
