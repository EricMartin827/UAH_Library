/* NPM Imports */
import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

/* Import Local Reducers */
import currentUserReducer from "./CurrentUserReducer.js"
import usersReducer from "./UsersReducer.js";
import playsReducer from './reducer_plays';
import checkedPlaysReducer from './reducer_checked_plays.js';
import allCheckedPlaysReducer from './reducer_all_checked_plays.js';

const rootReducer = combineReducers({
    currentUser  : currentUserReducer,
    users        : usersReducer,
    plays        : playsReducer,
    form         : formReducer,
    checkedPlays : checkedPlaysReducer,
    allCheckedPlays : allCheckedPlaysReducer
});

export default rootReducer;
