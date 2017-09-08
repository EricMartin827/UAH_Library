import axios from "axios";

export const URL = "https://uahlibrary.herokuapp.com"
export const ADMIN_TOK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OWIxODkxNjQwNjVmZDAwMTIxYzVjMTEiLCJhY2Nlc3MiOiJhZG1pbiIsImlhdCI6MTUwNDgwNzIwN30.o14r7Ei30fXp1hYTwYo01i-j_YzgLSK4lhtINEH4Oas"

export const GET_USERS = "get_users";
export const POST_USERS = "post_users";
export const LOGIN_USER = "login_user";
export const REGISTER_USER = "register_user";

var config = {
    headers : {"x-admin" : ADMIN_TOK}
}

export function fetchUsers() {

    const request = axios.get(`${URL}/api/users`, config);

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

    const { access } = credentials;
    console.log("LoginUser Access: ", access);
    const request = axios.post(`${URL}/${access}/login`, credentials)
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
    console.log("You did send : ", {newPassword});
    console.log("You now send : ", {password : newPassword})
    const request = axios.post(`${URL}/register`, { password : newPassword }, config)
        .then((res) => {

            console.log("Server Register Response: ", res);
            var { data , headers } = res;

            if (headers["x-admin"]) {
                data.token = headers["x-admin"];
            } else {
                data.token = headers["x-user"];
            }

            gotoPlays();
            console.log("Returning Register Data: ", data);
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
