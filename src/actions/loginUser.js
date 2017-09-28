import axios from "axios";
import { URL, LOGIN_USER } from "./types";

export default function loginUser(credentials, gotoRegister, gotoPlays) {

    const { access } = credentials;
    const request = axios.post(`${URL}/${access}/login`, credentials)
        .then((res) => {

            var { data , headers } = res;
            if (headers["x-register"]) {
                data.token = headers["x-register"];
                gotoRegister();
            } else {

                if (headers["x-admin"]) {
                    data.token = headers["x-admin"];
                } else {
                    data.token = headers["x-user"];
                }

                gotoPlays();
            }

            return {
                type : LOGIN_USER,
                payload : data
            }

        }).catch((err) => console.log(err));

    return {
        type : LOGIN_USER,
        payload : request
     }
}
