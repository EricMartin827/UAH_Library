import axios from "axios";

export const FETCH_PLAYS = "fetch_plays";

export default function fetchPlays() {
    const request = axios.get(***URL Here***);
    return {
	type : FETCH_PLAYS
    }
}
