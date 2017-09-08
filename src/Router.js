import React from "react";

/*
 * BrowserRouter tells react router to look at the entire URL
 * when determining which component to displace in the HTML
 * container.
 */
import { BrowserRouter, Route, Switch } from "react-router-dom";

/* Application Routes */
import Intro from "./components/Intro.js";
import AdminLogin from "./components/AdminLogin.js";
import UserLogin from "./components/UserLogin.js";
import Plays from "./components/Plays.js";
import Users from "./components/Users.js";
import Register from "./components/Register.js";
import PostUser from "./components/posts/PostUser.js";

/*
 * BUG: Webpack-dev-server and React Router seem to fail on nested
 * urls. Will try to fix. /newuser to /user/new ;)
 */
const Routes = () => {
    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route path="/newuser" component={PostUser} />
                    <Route path="/user(s)?" component={Users} />
                    <Route path="/play(s)?" component={Plays} />
                    <Route path="/adminlogin" component={AdminLogin} />
                    <Route path="/userlogin" component={UserLogin} />
                    <Route path="/register" component={Register} />
                    <Route path="/" component={Intro} />
                </ Switch>
            </div>
        </BrowserRouter>
    );
};
export default Routes;
