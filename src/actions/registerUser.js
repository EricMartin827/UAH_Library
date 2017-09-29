import axios from "axios";
import { URL, REGISTER_USER } from "./types";

export default function registerUser(newPassword, token, gotoPlays) {

    const config = { headers : { "x-register" : token } }
    const request = axios.post(`${URL}/register`, { password : newPassword }, config)
        .then((res) => {

            var { data , headers } = res;

            if (headers["x-admin"]) {
                data.token = headers["x-admin"];
            } else {
                data.token = headers["x-user"];
            }

            gotoPlays();
            return {
                type : REGISTER_USER,
                payload : data
            }

        }).catch((err) => console.log(err));

    return {
        type : REGISTER_USER,
        payload : request
     }
}
