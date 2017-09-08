import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";

import { fetchUsers } from "./../actions";

class Users extends Component {

    /* After React has rendered the component, fetch users from
     * the database.
     */
    componentDidMount() {
        this.props.fetchUsers();
    }

    render() {
        return (
            <div>
                <div className="text-xs-right">
                    <Link className="btn btn-primary" to="/newuser">
                        Add New User
                    </Link>
                </div>
                <h3>Current Users</h3>
                <ul className="list-group">
                    {this.renderUsers()}
                </ul>
            </div>
        )
    }


    renderUsers() {
        return _.map(this.props.users, (user) => {
            return (
                <li key={user._id} className="list-group-item">
                    {user.firstName}
                </li>
            );
        });
    }
}


function mapStateToProps(state) {
    return {users: state.users};
}

export default connect(mapStateToProps, { fetchUsers })(Users);
