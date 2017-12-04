/* NPM Imports */
import _ from 'lodash'

/* Local Imports */
import { FETCH_CHECKED_PLAYS } from './../actions/types';

export default function(state = {}, action) {
    switch(action.type) {
        case FETCH_CHECKED_PLAYS:
            return _.mapKeys(action.payload.data, '_id');
        default:
          return state;
    }
}
