import { combineReducers } from "redux";

/* Import Local Reducers */
import usersReducer from "./UsersReducer.js";

const rootReducer = combineReducers({
    users : usersReducer 
});

export default rootReducer;
