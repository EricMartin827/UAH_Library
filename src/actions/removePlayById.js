import axios from "axios";
import { URL, ADMIN_HEADER, DELETE_PLAY_ID } from "./types";
import createHeader from "./utils/createHeader";

export default function removePlayById(token, id) {

    const apiCall = `${URL}/api/plays/delete/${id}`;
    const request = axios.post(apiCall, {}, createHeader(ADMIN_HEADER, token));

    return {
        type : DELETE_PLAY_ID,
        payload : request
    };
}
