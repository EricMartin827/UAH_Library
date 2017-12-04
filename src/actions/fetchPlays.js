import axios from "axios";
import { URL, FETCH_PLAYS } from "./types";
import createHeader from "./utils/createHeader";

export default function fetchPlays(access, token) {

    const apiCall = `${URL}/api/plays`;
    const request = axios.get(apiCall, createHeader(access, token));

    return {
        type : FETCH_PLAYS,
        payload: request
    };
}
