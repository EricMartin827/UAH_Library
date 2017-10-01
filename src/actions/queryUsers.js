import axios from "axios";
import  { URL, FETCH_USERS } from "./types.js";
import toQuery from "./utils/queryFormer";

export default function queryUsers(access, token, queryObj) {

    const key = `x-${access}`;
    const config = {
        key : token
    };
    const apiCall = `${URL}/api/users?${toQuery(queryObj)}`;

    const request = axios.get(apiCall, config);
    return {
        type : FETCH_USERS,
        payload : request
    };
}
