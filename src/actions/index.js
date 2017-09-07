import axios from "axios";

export const FETCH_PLAYS = "fetch_plays";
export const URL = "https://uahlibrary.herokuapp.com"
export const ADMIN_TOK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OWFkYWQzY2ZhY2ZjYjAwMTEyODFlMjciLCJhY2Nlc3MiOiJhZG1pbiIsImlhdCI6MTUwNDU1NDMxOH0.mx65zfgZB6xNDSvoZUy5t43ahTd7ofNkF55CGcYkDks"


var config = {
    headers : {"x-admin" : ADMIN_TOK}
}

export default function fetchPlays() {
    const request = axios.get(`${URL}/api/plays`, config);
    return {
	type : FETCH_PLAYS
    }
}
