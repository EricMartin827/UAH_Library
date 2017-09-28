import axios from "axios";
import { URL, ADMIN_HEADER, POST_USERS } from "./types";
import createHeader from "./utils/createHeader";

export default function addUsers(token, users, callback) {

    const apiCall = `${URL}/api/users/new`;
    const request = axios.post(apiCall,
        users, createHeader(ADMIN_HEADER, token))
        .then(() => callback());

    return {
        type : POST_USERS,
        payload : request
    };
}
