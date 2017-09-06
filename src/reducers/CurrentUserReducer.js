import _ from "lodash";
import { USER_LOGIN } from "./../actions";

export default function(state = {}, action ) {

    switch (action.type) {
        case USER_LOGIN:
            console.log("Reducer Payload: ", action.payload);
            console.log("Reducer Data: ", action.payload.data);
            return action.payload.data;
        default:
            return state;
    }
}
