import axios from "axios";
import { URL, ADMIN_HEADER, DELETE_COMMENT_ID } from "./types";
import createHeader from "./utils/createHeader";

export default function removeCommentById(token, id) {

    const apiCall = `${URL}/api/comments/delete/${id}`;
    const request = axios.post(apiCall, {}, createHeader(ADMIN_HEADER, token));

    return (dispatch) => {

        request.then((res) => {

            const { data } = res;

            dispatch({
                type : DELETE_COMMENT_ID,
                payload : data._id
            });
        });
    }
}
