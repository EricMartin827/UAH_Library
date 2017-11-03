import axios from "axios";
import { URL, RETURN_PLAY } from "./types";
import createHeader from "./utils/createHeader";

export default function checkoutPlay(access, token, id) {

    const apiCall = `${URL}/api/play/checkout/delete/${id}`;
    const none = '';
    const request = axios.post(apiCall, none, createHeader(access, token));

    return {
        type : RETURN_PLAY,
        payload: request
    }
}
