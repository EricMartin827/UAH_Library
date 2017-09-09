/* NPM Imports */
import _ from 'lodash'

/* Local Imports */
import { FETCH_PLAYS, FETCH_PLAY_DETAILS } from './../actions';

export default function(state = {}, action) {
    switch(action.type) {
        case FETCH_PLAYS:
            return _.mapKeys(action.payload.data, "_id");
        case FETCH_PLAY_DETAILS:
            const newState = {}
            Object.assign(newState, state);
            const play  = action.payload.data;
            newState[play._id] = play;
            return newState;
        default:
          return state;
    }
}
