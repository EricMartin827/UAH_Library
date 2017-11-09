import axios from "axios";
import { URL, ADMIN_HEADER, POST_USERS } from "./types";
import createHeader from "./utils/createHeader";

export default function addUsers(token, users, callback) {

    const apiCall = `${URL}/api/users/new`;
    const request = axios.post(apiCall,
        users, createHeader(ADMIN_HEADER, token))
        .then(() => callback());

    const email = users["email"];
    const password = users["password"];
    const name     = users["firstName"] + " " + users["lastName"]
    send_welcome_email(email, password, name);

    return {
        type : POST_USERS,
        payload : request
    };
}

function send_welcome_email(email, password, name) {

    const data = {
        'email' : email,
        'password' : password,
        'name' : name
    };

    $.ajax({
      url: `/php/send_welcome_email.php`,
      type: "POST",
      success: function(data) {
        console.log('success')
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.log('error')
      }.bind(this)
    });

}
