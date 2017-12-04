import axios from "axios";
import { URL, ADMIN_HEADER, POST_USERS } from "./types";
import createHeader from "./utils/createHeader";

export default function addUsers(token, users, callback) {

    const email    = users["email"];
    const password = users["password"];
    const name     = users["firstName"]

    const apiCall = `${URL}/api/users/new`;
    const request = axios.post(apiCall,
        users, createHeader(ADMIN_HEADER, token))
        .then(() => callback())
        .then(() => send_welcome_email(email, password, name));

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
      url: 'http://18.221.128.155/UAH_Emailer/php/send_welcome_email.php',
      type: "POST",
      data: JSON.stringify(data),
      success: function(data) {
        console.log('success')
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
        console.log('error')
      }.bind(this)
    });

}
