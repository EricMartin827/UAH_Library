import axios from "axios";

export const URL = "https://uahlibrary.herokuapp.com"
export const ADMIN_TOK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OWFkYWQzY2ZhY2ZjYjAwMTEyODFlMjciLCJhY2Nlc3MiOiJhZG1pbiIsImlhdCI6MTUwNDU1NDMxOH0.mx65zfgZB6xNDSvoZUy5t43ahTd7ofNkF55CGcYkDks"

export const GET_USERS = "get_users";
export const POST_USERS = "post_users";
export const LOGIN_USER = "login_user";

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


export function loginUser(credentials, callback) {

    /*Little Hack To Get Going -> Must get this from form ??? */
    credentials.access = "admin";
    const { access } = credentials;
    const request = axios.patch(`${URL}/${access}/login`, credentials, config)
        .then((res) => {
            callback()
            // const data = res.data;
            // const headers = res.headers;
            // console.log("Response Data: ", data);
            // console.log("Response Header: ", headers);
            console.log("Server Response: ", res);
            return {
                type : LOGIN_USER,
                payload : res
            }
        }).catch((err) => console.log(err));

    console.log("Returning");
    //return { type : null };
    return {
        type : LOGIN_USER,
        payload : request
     }
}
