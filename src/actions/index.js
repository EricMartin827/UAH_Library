import axios from "axios";

export const URL = "https://uahlibrary.herokuapp.com/api"
export const ADMIN_TOK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OWFkYWQzY2ZhY2ZjYjAwMTEyODFlMjciLCJhY2Nlc3MiOiJhZG1pbiIsImlhdCI6MTUwNDU1NDMxOH0.mx65zfgZB6xNDSvoZUy5t43ahTd7ofNkF55CGcYkDks"
export const FETCH_USERS = "fetch_users";

var config = {
    headers : {"x-admin" : ADMIN_TOK}
}

export default function fetchUsers() {

    const request = axios.get(`${URL}/users`, config);

        return {
	           type : FETCH_USERS,
               payload : request
           };
}
