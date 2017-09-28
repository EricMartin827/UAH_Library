import axios from "axios";
import { URL, GET_USERS } from "./types";
import createHeader from "./utils/createHeader";

export default function fetchUsers(access, token) {

    const apiCall = `${URL}/api/users`;
    const request = axios.get(`${URL}/api/users`, createHeader(access, token));

    return {
           type : GET_USERS,
           payload : request
       };
}
