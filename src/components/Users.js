/* NPM Imports */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";

/* Local Imports */
import { fetchUsers, removeUserById } from "./../actions";
import { SearchBar } from "./../containers";

class Users extends Component {

    constructor(props) {
        super(props);
    }

    removeUser(id) {
        this.props.removeUserById(this.props.token, id,
            () => this.props.history.push("/users"));
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
            <div>
                <div className="text-xs-right">
                    <Link className="btn btn-primary" to="/user/new">
                        Add New User
                    </Link>
                </div>
                <div className="text-xs-right">
                    <Link className="btn btn-primary" to="/user/mnew">
                        Add Many New Users
                    </Link>
                </div>
                <SearchBar />
                <h3>Current Users</h3>
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
        )
    }

    renderUsers() {
        return _.map(this.props.users, (user) => {
            return (
                <tr key={user._id}>
                    <td>
                        <Link to={`/users/${user._id}`}>
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

export default connect(mapStateToProps, { fetchUsers, removeUserById })(Users);
