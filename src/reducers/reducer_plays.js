import { FETCH_PLAYS } from '../actions';
import _ from 'lodash'

export default function(state = {}, action) {
    switch(action.type) {
        case FETCH_PLAYS:

          console.log("action payload:", action.payload);
          var toRet =  action.payload.data;
          console.log("returning", toRet);
          return _.mapKeys(toRet, "_id");
        default:
          return state;
    }
}
