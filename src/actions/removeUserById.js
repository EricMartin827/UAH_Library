import axios from "axios";
import { URL, ADMIN_HEADER, DELETE_USER_ID } from "./types";
import createHeader from "./utils/createHeader";

export default function removeUserById(token, id) {

    const apiCall = `${URL}/api/users/delete/${id}`;
    console.log(createHeader(ADMIN_HEADER, token));
    const request = axios.post(apiCall, {} ,createHeader(ADMIN_HEADER, token));

    return {
        type : DELETE_USER_ID,
        payload : request
    };
}
