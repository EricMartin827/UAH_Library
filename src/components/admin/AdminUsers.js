/* NPM Imports */
import { ButtonToolbar, Button, ButtonGroup, Col } from 'react-bootstrap';
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";

/* Local Imports */
import AdminNavigation from "./AdminNavigation.js";
import { fetchUsers, removeUserById } from "./../../actions";
import { SearchBar } from "./../../containers";
import { ADMIN_USERS, ADMIN_USER_ID } from "./../paths";

class AdminUsers extends Component {

    constructor(props) {
        super(props);
    }

    removeUser(id) {
        this.props.removeUserById(this.props.token, id,
            () => this.props.history.push(ADMIN_USERS));
    }

    componentDidMount() {
        const { access, token } = this.props;
        if (access && token) {
            this.props.fetchUsers(access, token);
        }
    }

    render() {
        const { users } = this.props;

        if (!users) {
            return (<div>Loading User Content...</div>);
        }

        return (
            <div className="users-div-custom-padding">
                <h3 className="text-center">Current Users</h3>
                <SearchBar />
                <div className="rowContent">
                <AdminNavigation />
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Permissions</th>
                            <th>Delete User</th>
                        </tr>
                        </thead>
                        <tbody>
                            {this.renderUsers()}
                        </tbody>
                </table>
                </div>
            </div>
        )
    }

    renderUsers() {
        return _.map(this.props.users, (user) => {
            return (
                <tr key={user._id}>
                    <td>
                        <Link to={`${ADMIN_USER_ID}/${user._id}`}>
                            {user.email}
                        </Link>
                    </td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.access}</td>
                    <td><button type="button" className="btn btn-danger"
                            onClick={this.removeUser.bind(this, user._id)}>
                        Delete</button>
                    </td>
                </tr>
            );
        });
    }
}


function mapStateToProps(state) {
    return {
        access : state.currentUser.access,
        token : state.currentUser.token,
        users : state.users
    };
}

export default connect(mapStateToProps,
    { fetchUsers, removeUserById })(AdminUsers);
