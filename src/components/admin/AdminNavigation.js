/* NPM Imports */
import React, { Component } from "react";
import { Link } from "react-router-dom"
import { ButtonGroup } from "react-bootstrap";

/* Local Imports */
import { ADMIN_PLAY, ADMIN_POST_PLAY, ADMIN_POST_MANY_PLAYS, ADMIN_USER,
        ADMIN_POST_USER, ADMIN_POST_MANY_USERS } from "./../paths";

const AdminNavigation = () => {
    return (
        <div>
            <ButtonGroup vertical style={{padding: 30}}>
            <Link className="btn btn-primary" to={ADMIN_PLAY}>
                View Plays </ Link>
            <Link className="btn btn-primary" to={ADMIN_POST_PLAY}>
                Add A Play </ Link>
            <Link className="btn btn-primary" to={ADMIN_POST_MANY_PLAYS}>
                    Add Many Plays </ Link>
            <Link className="btn btn-primary" to={ADMIN_USER}>
                View Users </ Link>
            <Link className="btn btn-primary" to={ADMIN_POST_USER}>
                Add A User </ Link>
            <Link className="btn btn-primary" to={ADMIN_POST_MANY_USERS}>
                Add Many Users </ Link>
            </ ButtonGroup>
        </div>
    );
}

export default AdminNavigation;
