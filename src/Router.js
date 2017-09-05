import React from "react";

/*
 * BrowserRouter tells react router to look at the entire URL
 * when determining which component to displace in the HTML
 * container.
 */
import { BrowserRouter, Route, Switch } from "react-router-dom";

/* Application Routes */
import Intro from "./components/Intro.js";
import Login from "./components/Login.js";
import Plays from "./components/Plays.js";
import Users from "./components/Users.js";

const Routes = () => {
    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route path="/plays" component={Plays}></Route>
                    <Route path="/users" component={Users}></Route>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/" component={Intro}></Route>
                </ Switch>
            </div>
        </BrowserRouter>
    );
};
export default Routes;
