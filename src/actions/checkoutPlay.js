import axios from "axios";
import { URL, CHECKOUT_PLAY } from "./types";
import createHeader from "./utils/createHeader";

export default function checkoutPlay(access, token, id) {

    const apiCall = `${URL}/api/play/checkout/${id}`;
    const none = '';
    const request = axios.post(apiCall, none, createHeader(access, token));

    return {
        type : CHECKOUT_PLAY,
        payload: request
    }
}
