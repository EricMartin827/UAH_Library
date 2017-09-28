/* NPM Imports */
import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

/* Import Local Reducers */
import currentUserReducer from "./CurrentUserReducer.js"
import usersReducer from "./UsersReducer.js";
import playsReducer from './reducer_plays';
import navsReducer from './reducer_navs';


const rootReducer = combineReducers({
    currentUser : currentUserReducer,
    users       : usersReducer,
    plays       : playsReducer,
    form        : formReducer,
    navs        : navsReducer
});

export default rootReducer;
