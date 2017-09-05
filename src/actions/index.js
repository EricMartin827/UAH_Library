import axios from "axios";

export const URL = "https://uahlibrary.herokuapp.com/api"
export const ADMIN_TOK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OWFkYWQzY2ZhY2ZjYjAwMTEyODFlMjciLCJhY2Nlc3MiOiJhZG1pbiIsImlhdCI6MTUwNDU1NDMxOH0.mx65zfgZB6xNDSvoZUy5t43ahTd7ofNkF55CGcYkDks"

export const GET_USERS = "get_users";
export const POST_USERS = "post_users";

var config = {
    headers : {"x-admin" : ADMIN_TOK}
}

export function fetchUsers() {

    console.log(config);
    const request = axios.get(`${URL}/users`, config);

        return {
	           type : GET_USERS,
               payload : request
           };
}

export function addUsers(users, callback) {

    /* Little Hack To Get Going */
    users.access = "user";

    const request = axios.post(`${URL}/users/new`, users, config)
        .then(() => callback());

    return {
        type : POST_USERS,
        payload : request
    }
}
