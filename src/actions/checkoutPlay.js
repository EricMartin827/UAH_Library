import axios from "axios";
import { URL, CHECKOUT_PLAY } from "./types";

export default function checkoutPlay(access, token, id) {

    const key = `x-${access}`;

    const apiCall = `${URL}/api/play/checkout/${id}`;
    const request = axios.get(apiCall, {});

    return {
        type : CHECKOUT_PLAY,
        payload: request
    }
}
