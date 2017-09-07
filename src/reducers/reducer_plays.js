import { FETCH_PLAYS} from '../actions';

export default function(state = {}, action) {
    switch(action.type) {
        case FETCH_PLAYS:
          console.log("Payload: " + action.payload)
          return _.mapKeys(action.payload, 'id');
        default:
          return state;
    }
}
