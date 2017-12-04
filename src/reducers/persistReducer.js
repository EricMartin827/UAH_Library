/* NPM Imports */
import _ from 'lodash'

/* Local Imports */
import { FETCH_CHECKED_PLAYS } from './../actions/types';

export default function(state = {}, action) {
    switch(action.type) {
        case "persist/Rehydrate":
            return { ... state, persistedState: action.payload};
        default:
          return state;
    }
}
