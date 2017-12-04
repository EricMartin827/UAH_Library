/* NPM Imports */
import _ from 'lodash'

/* Local Imports */
import { FETCH_PLAYS, FETCH_PLAY_DETAILS,
    POST_PLAYS, DELETE_PLAY_ID } from './../actions/types';

export default function(state = {}, action) {
    switch(action.type) {
        case FETCH_PLAYS:
            return _.mapKeys(action.payload.data, "_id");
        case FETCH_PLAY_DETAILS:
            const newState = {}
            Object.assign(newState, state);
            const play  = action.payload.data;
            console.log("Payload: ", action.payload);
            newState[play._id] = play;
            return newState;
        case DELETE_PLAY_ID: /*Have to change this*/
            console.log(action.payload);
            const newState1 = Object.assign(state);
            delete newState1[action.payload._id];
            return newState1;
        case POST_PLAYS:
            return state;
        default:
          return state;
    }
}
