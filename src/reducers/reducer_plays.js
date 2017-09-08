/* NPM Imports */
import _ from 'lodash'

/* Local Imports */
import { FETCH_PLAYS, FETCH_PLAY_DETAILS } from './../actions';

export default function(state = {}, action) {
    switch(action.type) {
        case FETCH_PLAYS:
            console.log("Inital State: ", state);
            console.log("New State: ", _.mapKeys(action.payload.data, "_id"));
            return _.mapKeys(action.payload.data, "_id");
        case FETCH_PLAY_DETAILS:
            console.log("Initial State: ", state);
            const newState = {}
            Object.assign(newState, state);
            const play  = action.payload.data;
            console.log("Copied State: ", newState);
            newState[play._id] = play;
            console.log("New State: ", newState);
            return newState;
        default:
          return state;
    }
}
