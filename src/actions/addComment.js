import axios from "axios";
import { URL , ADMIN_HEADER, POST_COMMENT } from "./types";
import createHeader from "./utils/createHeader";

export default function addComment(token, playId, comment, callback) {
    const request = axios.post(`${URL}/api/comment/new`,
        playId, comment, createHeader(ADMIN_HEADER, token))
    .then(() => callback());

    return {
        type : POST_COMMENT,
        payload : request
    };
}
