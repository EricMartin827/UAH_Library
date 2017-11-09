import axios from "axios";
import { URL, FETCH_CHECKED_PLAYS } from "./types";
import createHeader from "./utils/createHeader";

export default function fetchCheckedPlays(access, token) {

    const apiCall = `${URL}/api/user/checkout`;
    const request = axios.get(apiCall, createHeader(access, token));

    return {
        type : FETCH_CHECKED_PLAYS,
        payload: request
    }
}
