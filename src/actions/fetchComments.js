import axios from "axios";
import { URL, FETCH_PLAYS } from "./types";
import createHeader from "./utils/createHeader";

export default function fetchComments(access, token, playID) {

    const apiCall = `${URL}/api/comments`;
    const request = axios.get(apiCall, createHeader(access, token));
    return {
        type : FETCH_COMMENTS,
        payload: request
    };
}
