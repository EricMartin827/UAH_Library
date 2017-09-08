import React from "react";
import {Switch} from 'react-router-dom'

/*
 * BrowserRouter tells react router to look at the entire URL
 * when determining which component to displace in the HTML
 * container.
 */
import { BrowserRouter, Route } from "react-router-dom";

/* Application Routes */
import Intro from "./components/Intro.js"
import Login from "./components/Login.js";
import Plays from "./components/Plays.js";
import Play_Details from "./components/Play_Details.js";

const Routes = () => {
    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/plays" component={Plays}></Route>
                    <Route path="/play_details" component={Play_Details}></Route>
                    <Route path="/" component={Intro}></Route>
                </Switch>
            </div>
        </BrowserRouter>
    );
};
export default Routes;
