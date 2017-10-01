import axios from "axios";
import { URL, FETCH_USER_ID } from "./../types";
import createHeader from "./../utils/createHeader";

export default function fetchUserById(access, token, id) {

    const apiCall = `${URL}/api/users`;
    const request = axios.get(`${URL}/api/users/${id}`,
        createHeader(access, token));

    console.log("Sending Tokens: ", createHeader(access, token));

    return (dispatch) => {
        request.then((res) => {
            const { data } = res;
            dispatch({
                type : FETCH_USER_ID,
                payload : data
            });
        });
    };
}
