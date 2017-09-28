/* NPM Imports */
import _ from 'lodash'

/* Local Imports */
import { FETCH_PLAYS, FETCH_PLAY_DETAILS,
    POST_PLAYS } from './../actions/types';

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
        case POST_PLAYS:
            return state;
        default:
          return state;
    }
}
