/* NPM Imports */
import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

/* Import Local Reducers */
import currentUserReducer from "./CurrentUserReducer.js"
import usersReducer from "./UsersReducer.js";
import playsReducer from './reducer_plays';

const rootReducer = combineReducers({
    currentUser : currentUserReducer,
    users       : usersReducer,
    plays       : playsReducer,
    form        : formReducer
});

export default rootReducer;
