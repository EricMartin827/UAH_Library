import axios from "axios";
import { URL, REGISTER_USER } from "./types";

export default function registerUser(newPassword, token, gotoPlays) {

    const config = { headers : { "x-register" : token } }
    const request = axios.post(`${URL}/register`, { password : newPassword }, config);

    return (dispatch) => {

        request.then((res) => {

            const { data, headers } = res;
            data.token = (headers["x-admin"]) ? headers["x-admin"]
                : headers["x-user"];

            dispatch({
                type : REGISTER_USER,
                payload : data
            })
            gotoPlays();

        });
    }
}
