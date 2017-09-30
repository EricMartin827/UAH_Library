/* NPM Imports */
import _ from "lodash";

/* Local Imports */
import { GET_USERS, POST_USERS, LOGIN_USER,
    DELETE_USER_ID } from "./../actions/types"

export default function(state = {}, action) {

    switch (action.type) {
        case GET_USERS:
            return _.mapKeys(action.payload.data, "_id");
        case POST_USERS:
            return state;
        case DELETE_USER_ID:
            console.log(action.payload);
            const newState = Object.assign(state);
            delete newState[action.payload._id];
            return newState;
        default:
            return state;
    }
}
