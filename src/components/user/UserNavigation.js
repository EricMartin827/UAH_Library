/* NPM Imports */
import React, { Component } from "react";
import { Link } from "react-router-dom"
import { ButtonGroup } from "react-bootstrap";

/* Local Imports */
import { USER_PLAY } from "./../paths";

const UserNavigation = () => {
    return (
        <div>
            <ButtonGroup vertical style={{padding: 30}}>
            <Link className="btn btn-primary" to={USER_PLAY}>
                View Plays </Link>
            </ButtonGroup>
        </div>
    );
}

export default UserNavigation;
