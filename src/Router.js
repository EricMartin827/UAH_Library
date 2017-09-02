import React from "react";

/*
 * BrowserRouter tells react router to look at the entire URL
 * when determining which component to displace in the HTML
 * container.
 */
import { BrowserRouter, Route } from "react-router-dom";

/* Application Routes */
import Login from "./components/Login.js";
import Plays from "./components/Plays.js";

const Routes = () => {
    return (
        <BrowserRouter>
            <div>
                <Route path="/login" component={Login}></Route>
                <Route path="/plays" component={Plays}></Route>
            </div>
        </BrowserRouter>
    );
};
export default Routes;
