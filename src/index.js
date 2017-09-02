/* NPM imports */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";

/* Client Applciation Imports */
import Routes from "./Router.js";
import reducers from "./reducers";

const MainApp = () => {
        const store = applyMiddleware()(createStore);
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
