import axios from "axios";
import { URL, FETCH_ALL_CHECKED_PLAYS } from "./types";
import createHeader from "./utils/createHeader";

export default function fetchAllCheckedPlays(access, token) {

    console.log("fetchAllCheckedPlays");
    const apiCall = `${URL}/api/play/checkout/all`;
    const request = axios.get(apiCall, createHeader(access, token));

    return {
        type : FETCH_ALL_CHECKED_PLAYS,
        payload: request
    }
}
