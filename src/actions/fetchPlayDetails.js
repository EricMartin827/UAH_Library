import axios from "axios";
import { URL, FETCH_PLAY_DETAILS } from "./types";

export default function fetchPlayDetails(access, token, id) {

    const key = `x-${access}`;
    const config = {
        key : token
    };
    const apiCall = `${URL}/api/plays/${id}`;

    const request = axios.get(apiCall, config);
    return {
        type : FETCH_PLAY_DETAILS,
        payload: request
    }
}
