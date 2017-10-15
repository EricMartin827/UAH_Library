import React , { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserById, removeUserById } from "./../../actions";
import { ADMIN_USERS } from "./../paths";

class UserDetails extends Component {

    componentDidMount() {

        const { access, token, selectedUser } = this.props;
        const { id } = this.props.match.params;

        if (access && token && !selectedUser) {
            this.props.fetchUserById(access, token, id)
        }
    }

    onDeleteClick() {
        const {token, selectedUser} = this.props;
        if (token && selectedUser) {
            this.props.removeUserById(token, selectedUser._id,
            () => this.props.history.push(ADMIN_USERS));
        }
    }

    render() {

        const { selectedUser } = this.props;
        if (!selectedUser) {
            return (
                <div>Loading...</div>
            );
        }

        return (
            <div>
                <Link to="/users"> Return To Users</Link>
                <button className="btn btn-danger pull-xs-right"
                    onClick={this.onDeleteClick.bind(this)}>
                Delete User
                </button>
                <h3>{selectedUser.firstName}</h3>
                <h3>{selectedUser.lastName}</h3>
                <h3>{selectedUser.access}</h3>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {

    return {
        access : state.currentUser.access,
        token : state.currentUser.token,
        selectedUser : state.users[ownProps.match.params.id]
    };
}

export default connect(mapStateToProps,
    { fetchUserById, removeUserById })(UserDetails);
