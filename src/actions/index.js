import axios from "axios";

export const FETCH_PLAYS = "fetch_plays";
export const URL = "https://uahlibrary.herokuapp.com"
export const ADMIN_TOK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OWIxODkxNjQwNjVmZDAwMTIxYzVjMTEiLCJhY2Nlc3MiOiJhZG1pbiIsImlhdCI6MTUwNDgwNzIwN30.o14r7Ei30fXp1hYTwYo01i-j_YzgLSK4lhtINEH4Oas"


var config = {
    headers : {"x-admin" : ADMIN_TOK}
}

export default function fetchPlays() {
    const request = axios.get(`${URL}/api/plays`, config);
    return {
	    type : FETCH_PLAYS,
        payload: request
    }
}

export function fetchPlayDetails(id) {
    const request = axios.get(`${URL}/api/plays/${id}`, config);
    return {
	    type : FETCH_PLAYS,
        payload: request
    }
}
