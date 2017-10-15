import React from "react";

/*
 * BrowserRouter tells react router to look at the entire URL
 * when determining which component to displace in the HTML
 * container.
 */
import { BrowserRouter, Route, Switch } from "react-router-dom";

/* Application Routes */
import { Intro, Register,

        /* User Specific */
        UserLogin, UserPlays,

        /* Admin Specific */
        AdminLogin, AdminPlays, AdminUsers,
        UserDetails, PlayDetails, AdminNavigation, PostMultiplePlays,
        PostMultipleUsers, PostUser, PostPlay

        } from "./components";

/* Path names for URL */
import {

    ROOT, REGISTER,

    ADMIN_LOGIN,
    ADMIN_PLAY, ADMIN_POST_PLAY, ADMIN_POST_MANY_PLAYS,
    ADMIN_USER, ADMIN_POST_USER, ADMIN_POST_MANY_USERS,

    USER_LOGIN,
    USER_PLAY

} from "./components/paths";

const Routes = () => {
    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route path={ADMIN_LOGIN}
                            component={AdminLogin} />

                    <Route path={ADMIN_POST_MANY_USERS}
                                component={PostMultipleUsers} />
                    <Route path={ADMIN_POST_USER}
                                component={PostUser} />
                    <Route path={`${ADMIN_USER}/:id`}
                                component={UserDetails} />
                    <Route path={ADMIN_USER}
                                component={AdminUsers} />

                    <Route path={ADMIN_POST_MANY_PLAYS}
                                component={PostMultiplePlays} />
                    <Route path={ADMIN_POST_PLAY}
                                component={PostPlay} />
                    <Route path={`${ADMIN_USER}/:id`}
                                component={PlayDetails} />
                    <Route path={ADMIN_PLAY}
                                component={AdminPlays} />

                    <Route path={USER_LOGIN}
                                component={UserLogin} />

                    <Route path={`${USER_PLAY}/:id`}
                                component={UserLogin} />
                    <Route path={USER_PLAY}
                                component={UserPlays} />

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
