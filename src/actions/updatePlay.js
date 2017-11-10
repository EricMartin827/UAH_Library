import axios from "axios"
import {URL, ADMIN_HEADER, UPDATE_PLAY} from "./types";
import createHeader from "./utils/createHeader";

export default function updatePlay(token, play, id, callback) {
    const request = axios.post(`${URL}/api/play/update/${id}`,
        play, createHeader(ADMIN_HEADER, token))
    .then(() => callback());

    return {
        type : UPDATE_PLAY,
        payload : request
    };
}
