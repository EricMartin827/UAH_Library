/* NPM Imports */
import _ from "lodash";

/* Local Imports */
import { LOGIN_USER, REGISTER_USER } from "./../actions";

export default function(state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return action.payload.payload;
        case REGISTER_USER:
            const newState = Object.assign(state)
            const { token } = action.payload.payload;
            newState.token = token;
            return newState;
        default:
            return state;
    }
}
