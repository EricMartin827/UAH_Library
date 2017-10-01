import axios from "axios";
import { URL, FETCH_USERS } from "./types";
import createHeader from "./utils/createHeader";

export default function fetchUsers(access, token) {

    const apiCall = `${URL}/api/users`;
    const request = axios.get(`${URL}/api/users`, createHeader(access, token));

    return {
           type : FETCH_USERS,
           payload : request
       };
}
