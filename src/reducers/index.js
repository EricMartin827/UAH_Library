/* NPM Imports */
import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

/* Import Local Reducers */
import usersReducer from "./UsersReducer.js";

const rootReducer = combineReducers({
    form : formReducer,
    users : usersReducer
});

export default rootReducer;
