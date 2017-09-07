import axios from "axios";

export const URL = "https://uahlibrary.herokuapp.com"
export const ADMIN_TOK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OWFkYWQzY2ZhY2ZjYjAwMTEyODFlMjciLCJhY2Nlc3MiOiJhZG1pbiIsImlhdCI6MTUwNDU1NDMxOH0.mx65zfgZB6xNDSvoZUy5t43ahTd7ofNkF55CGcYkDks"

export const GET_USERS = "get_users";
export const POST_USERS = "post_users";
export const LOGIN_USER = "login_user";
export const REGISTER_USER = "register_user";

var config = {
    headers : {"x-admin" : ADMIN_TOK}
}

export function fetchUsers() {

    console.log(config);
    const request = axios.get(`${URL}/api/users`, config);

        console.log("Request is: ", request);
    return {
           type : GET_USERS,
           payload : request
       };
}

export function addUsers(users, callback) {

    /* Little Hack To Get Going */
    users.access = "admin";

    const request = axios.post(`${URL}/api/users/new`, users, config)
        .then(() => callback());

    return {
        type : POST_USERS,
        payload : request
    };
}


export function loginUser(credentials, gotoRegister, gotoPlays) {

    /*Little Hack To Get Going -> Must get this from form ??? */
    credentials.access = "admin";
    const { access } = credentials;
    const request = axios.patch(`${URL}/${access}/login`, credentials, config)
        .then((res) => {

            console.log("Server Login Response: ", res);
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
            console.log("Returning Login Data", data);
            return {
                type : LOGIN_USER,
                payload : data
            }

        }).catch((err) => console.log(err));

    console.log("Returning Login Request: ", request);
    return {
        type : LOGIN_USER,
        payload : request
     }
}


export function registerUser(newPassword, token, gotoPlays) {

    const config = { headers : { "x-register" : token } }
    console.log("You had sent : ", {newPassword});
    console.log("You now send : ", {password : newPassword})
    const request = axios.patch(`${URL}/register`, { password : newPassword }, config)
        .then((res) => {

            console.log("Server Register Response: ", res);
            var { data , headers } = res;

            if (headers["x-admin"]) {
                data.token = headers["x-admin"];
            } else {
                data.token = headers["x-user"];
            }

            gotoPlays();
            console.log("Returning Regist Data: ", data);
            return {
                type : REGISTER_USER,
                payload : data
            }

        }).catch((err) => console.log(err));

    console.log("Returning Register Request: ", request);
    return {
        type : REGISTER_USER,
        payload : request
     }
}
