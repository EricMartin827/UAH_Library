/* NPM Imports */
import React, { Component } from "react";
import { Link } from "react-router-dom"

/* Local Imports */
import { ADMIN_LOGIN , USER_LOGIN } from "./paths";

export default class Intro extends Component {

    render() {
        return (
            <div>
                <Link className="btn btn-primary" to={USER_LOGIN}>
                User Login</ Link>
                <Link className="btn btn-primary" to={ADMIN_LOGIN}>
                Admin Login</ Link>
            </div>
        );
    }
}
