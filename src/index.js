/* NPM imports */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { compose, createStore, applyMiddleware } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import promise from "redux-promise";

/* CSS Imports */
import "./../style/style.css"

/* Client Applciation Imports */
import Routes from "./Router.js";
import reducers from "./reducers";

const middleware = [promise, thunk];
 const store = compose(
    applyMiddleware(...middleware),
    autoRehydrate()
)(createStore)(reducers);
persistStore(store)

const MainApp = () => {
    return (
        <Provider store={store}>
            <Routes />
        </Provider>
    );
};

ReactDOM.render(
    <MainApp />,
    document.getElementById("container")
);
