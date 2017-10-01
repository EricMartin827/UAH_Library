import axios from "axios";
import { URL, ADMIN_HEADER, DELETE_USER_ID } from "./types";
import createHeader from "./utils/createHeader";

export default function removeUserById(token, id, callback) {

    const apiCall = `${URL}/api/users/delete/${id}`;
    const request = axios.post(apiCall, {} ,createHeader(ADMIN_HEADER, token));

    return (dispatch) => {

        request.then((res) => {

            const { data } = res;

            dispatch({
                type : DELETE_USER_ID,
                payload : data._id
            });
            callback();
        });
    }
}
