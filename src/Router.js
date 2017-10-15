import React from "react";

/*
 * BrowserRouter tells react router to look at the entire URL
 * when determining which component to displace in the HTML
 * container.
 */
import { BrowserRouter, Route, Switch } from "react-router-dom";

/* Application Routes */
import { Intro, Register, UserLogin, AdminLogin, AdminPlays, AdminUsers,
            UserDetails, PlayDetails, AdminNavigation, PostMultiplePlays,
            PostMultipleUsers, PostUser, PostPlay } from "./components";

/* Path names for URL */
import {

    ROOT, REGISTER,

    ADMIN_LOGIN, ADMIN_PLAYS, ADMIN_SPECIFIC_PLAY,
    ADMIN_POST_PLAY, ADMIN_POST_MANY_PLAYS, ADMIN_USERS, ADMIN_SPECIFIC_USER,
    ADMIN_POST_USER, ADMIN_POST_MANY_USERS,

    USER_LOGIN, USER_PLAYS, USER_SPECIFIC_PLAY

} from "./components/paths";

const Routes = () => {
    return (
        <BrowserRouter>
            <div>
                <Switch>

                    <Route path={ADMIN_POST_MANY_USERS}
                                component={PostMultipleUsers} />
                    <Route path={ADMIN_POST_USER}
                                component={PostUser} />
                    <Route path={ADMIN_SPECIFIC_USER}
                                component={UserDetails} />
                    <Route path={ADMIN_USERS}
                                component={AdminUsers} />

                    <Route path={ADMIN_POST_MANY_PLAYS}
                                component={PostMultiplePlays} />
                    <Route path={ADMIN_POST_PLAY}
                                component={PostPlay} />
                    <Route path={ADMIN_SPECIFIC_PLAY}
                                component={PlayDetails} />
                    <Route path={ADMIN_PLAYS}
                                component={AdminPlays} />

                    <Route path={ADMIN_LOGIN}
                                component={AdminLogin} />
                    <Route path={USER_LOGIN}
                                component={UserLogin} />

                    <Route path={REGISTER}
                                component={Register} />
                    <Route path={ROOT}
                                component={Intro} />
                </Switch>
            </div>
        </BrowserRouter>
    );
};
export default Routes;
