/* NPM Imports */
import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

/* Import Local Reducers */
import currentUserReducer from "./CurrentUserReducer.js"
import usersReducer from "./UsersReducer.js";
import PlaysReducer from './reducer_plays';


const rootReducer = combineReducers({
    currentUser : currentUserReducer,
    users : usersReducer,
    form : formReducer,
    plays        : PlaysReducer,
    play_details : PlaysReducer
});

export default rootReducer;
