/* NPM Imports */
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";

/* Local Imports */
import { addUsers } from "./../../actions";
import { renderField } from "./../../renderers";

class PostMultipleUsers extends Component {

    constructor(props) {
        super(props);
        this.state = {entryArray : [ 0 ] };
    }

    incrementUsers() {
        const arr = this.state.entryArray;
        this.setState({entryArray : arr.concat([arr.length])});
    }

    render() {
        return(
            <div>
            <h3>Add Multiple Users</h3>
            <div className="text-xs-right">
                <button className="btn btn-primary" type="button"
                    onClick={this.incrementUsers.bind(this)}>
                    Add Another
                </button>
            </div>
            <form>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Admin Access?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderUserInputs()}
                    </tbody>
                </table>
            </form>
            </div>
        );
    }

    renderUserInputs() {
        return _.map(this.state.entryArray, (entry) => {
            return (
                <tr key={entry}>
                    <td><Field type="text" name="email"
                            component={renderField} /> </td>
                    <td><Field type="text" name="firstName"
                            component={renderField} /> </td>
                    <td><Field type="text" name="lastName"
                            component={renderField} /> </td>
                    <td><Field type="checkbox" name="access"
                            component={renderField} /> </td >
                </tr>
                );
            });
        }

}

function mapStateToProps(state) {
    return {
        token : state.currentUser.token
    }
}

export default reduxForm({
    form : "PostMultipleNewUsers"
})(
    connect(mapStateToProps, { addUsers })(PostMultipleUsers)
);
