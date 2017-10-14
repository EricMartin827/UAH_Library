import React, { Component } from "react";
import { Link } from "react-router-dom"
import { ButtonGroup } from "react-bootstrap";

const AdminNavigation = () => {
    return (
        <div>
            <ButtonGroup vertical style={{padding: 30}}>
            <Link className="btn btn-primary" to="/plays">
                View Plays </ Link>
            <Link className="btn btn-primary" to="/users">
                View Users </ Link>
            <Link className="btn btn-primary" to="/users/new">
                Add A User </ Link>
            <Link className="btn btn-primary" to="/users/mnew">
                Add Many Users </ Link>
            </ ButtonGroup>
        </div>
    );
}

export { AdminNavigation };
