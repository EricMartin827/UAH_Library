/* NPM Imports */
import React, { Component } from "react";
import { Link } from "react-router-dom"
import { Col } from "react-bootstrap";

/* Local Imports */
import { ADMIN_LOGIN , USER_LOGIN } from "./paths";

export default class Intro extends Component {

    render() {
        const localStyles = {maxWidth: 400, margin: '0 auto 10px'};
        return (
            <div className='intro-div'>
                    <Link className="btn btn-primary intro-link-padding" to={USER_LOGIN}>
                    User Login</ Link>
                    <Link className="btn btn-primary intro-link-padding" to={ADMIN_LOGIN}>
                    Admin Login</ Link>
            </div>
        );
    }
}
