/* NPM Imports */
import _ from "lodash";

/* Local Imports */
import { GET_USERS, POST_USERS } from "./../actions"

export default function(state = {}, action) {

    switch (action.type) {
        case GET_USERS:
            return _.mapKeys(action.payload.data, "_id");
        case POST_USERS:
            return state;
        default:
            return state;
    }
}
