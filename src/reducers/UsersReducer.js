/* NPM Imports */
import _ from "lodash";

/* Local Imports */
import { FETCH_USERS, FETCH_USER_ID, POST_USERS, LOGIN_USER,
    DELETE_USER_ID } from "./../actions/types"

export default function(state = {}, action) {

    var newState;

    switch (action.type) {
        case FETCH_USERS:
            return _.mapKeys(action.payload.data, "_id");
        case FETCH_USER_ID:
            newState = Object.assign(state);
            newState[action.payload._id] = action.payload;
            return newState;
        case POST_USERS:
            return state;
        case DELETE_USER_ID:
            newState = Object.assign(state);
            delete newState[action.payload];
            return newState;
        default:
            return state;
    }
}
