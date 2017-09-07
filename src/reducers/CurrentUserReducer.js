/* NPM Imports */
import _ from "lodash";

/* Local Imports */
import { LOGIN_USER } from "./../actions";

export default function(state = {}, action) {

    switch (action.type) {
        case LOGIN_USER:
            console.log("CurrentUserReducer: ", action.payload);
            return action.payload;
        default:
            return state;
    }
}
