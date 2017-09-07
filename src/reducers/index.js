import { combineReducers } from "redux";
import PlaysReducer from './reducer_plays';

const rootReducer = combineReducers({
    plays : PlaysReducer
});

export default rootReducer;
