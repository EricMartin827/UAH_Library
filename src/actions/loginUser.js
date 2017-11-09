import axios from "axios";
import { URL, LOGIN_USER } from "./types";

export default function loginUser(credentials, gotoRegister, gotoPlays, error) {

    const { access } = credentials;
    const request = axios.post(`${URL}/${access}/login`, credentials);

    return (dispatch) => {

        request.then((res) => {

            const { data, headers } = res;
            data.token = (headers["x-register"]) ? headers["x-register"]
                : (headers["x-admin"]) ? headers["x-admin"] :
                headers["x-user"];

            dispatch({
                type : LOGIN_USER,
                payload : data
            })

            if (headers["x-register"]) {
                gotoRegister();
            } else {
                gotoPlays();
            }
        }).catch((err) => error());
    }
}
