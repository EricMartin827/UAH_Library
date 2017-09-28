import axios from "axios";
import { URL , ADMIN_HEADER, POST_PLAYS } from "./types";
import createHeader from "./utils/createHeader";

export default function addPlays(token, plays, callback) {
    const request = axios.post(`${URL}/api/play/new`,
        plays, createHeader(ADMIN_HEADER, token))
    .then(() => callback());

    return {
        type : POST_PLAYS,
        payload : request
    };
}
