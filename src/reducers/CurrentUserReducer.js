/* NPM Imports */
import _ from "lodash";

/* Local Imports */
import { LOGIN_USER, REGISTER_USER } from "./../actions";

export default function(state = {}, action) {

    switch (action.type) {
        case LOGIN_USER:
            console.log("CurrentUserReducerLogin: ", action.payload.payload);
            return action.payload.payload;
        case REGISTER_USER:
            const newState = Object.assign(state)
            console.log("Register User Payload: ", action.payload.payload);
            newState.token = action.payload.payload.token;
            console.log("CurrentUserReducerRegister", newState);
            return newState;
        default:
            return state;
    }
}
