import React, { Component } from "react";
import { Link } from "react-router-dom"

export default class Intro extends Component {

    render() {
        return (
            <div>
                <Link className="btn btn-primary" to="/userlogin">
                User Login</ Link>
                <Link className="btn btn-primary" to="/adminlogin">
                Admin Login</ Link>
            </div>
        );
    }
}
