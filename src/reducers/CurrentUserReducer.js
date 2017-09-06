/* NPM Imports */
import _ from "lodash";

/* Local Imports */
import { LOGIN_USER } from "./../actions";

export default function(state = {}, action) {

    switch (action.type) {
        case LOGIN_USER:
            // const { data : { headers, data }}= action.payload.payload;
            // console.log("Payload: ", action.payload.payload);
            // console.log("Login Reducer Action Data: ", data);
            // console.log("Login Reducer Action Header: ", headers)
            return action.payload;
        default:
            return state;
    }
}
