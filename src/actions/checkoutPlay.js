import axios from "axios";
import { URL, CHECKOUT_PLAY } from "./types";
import createHeader from "./utils/createHeader";

export default function checkoutPlay(access, token, id, error) {

    const apiCall = `${URL}/api/play/checkout/${id}`;
    const none = '';
    const request = axios.post(apiCall, none, createHeader(access, token));

    return (dispatch) => {

        request.then((res) => {

            dispatch({
                type : CHECKOUT_PLAY,
                payload : request
            })


        }).catch((err) => error());
    }
}
