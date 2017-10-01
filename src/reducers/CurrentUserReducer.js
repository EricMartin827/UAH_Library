/* NPM Imports */
import _ from "lodash";

/* Local Imports */
import { LOGIN_USER, REGISTER_USER,
    DELETE_USER_ID } from "./../actions/types";

export default function(state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return action.payload;
        case REGISTER_USER:
            const newState = Object.assign(state);
            const { token } = action.payload;
            newState.token = token;
            return newState;
        default:
            return state;
    }
}
