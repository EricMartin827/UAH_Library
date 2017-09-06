/* NPM Imports */
import _ from "lodash";

/* Local Imports */
import { GET_USERS, POST_USERS, LOGIN_USER } from "./../actions"

export default function(state = {}, action) {

    switch (action.type) {
        case GET_USERS:
            console.log("Get Reducer Action: ", action);
            return _.mapKeys(action.payload.data, "_id");
        case POST_USERS:
            console.log("Post Reducer Action: ", action);
            return state;
        default:
            return state;
    }
}
