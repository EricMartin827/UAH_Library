/* NPM Imports */
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";

/* Local Imports */
import { validateUser, processUserArrayForm } from "./utils";
import { addUsers } from "./../../actions";
import { renderField } from "./../../renderers";
import { AdminNavigation } from "./../admin";
import { ADMIN_USER } from "./../paths";

class PostMultipleUsers extends Component {

    constructor(props) {
        super(props);
        this.state = {entryArray : [ 0 ] };
    }

    incrementUsers() {
        const arr = this.state.entryArray;
        this.setState({entryArray : arr.concat([arr.length])});
    }

    onSubmit(values) {
        const { token } = this.props;
        this.props.addUsers(token, processUserArrayForm(values),
            () => {this.props.history.push(ADMIN_USER)});
    }

    render() {

        const { handleSubmit } = this.props;

        return (

            <div className="postmultipleusers-div-custom-padding">
            <h3 className="text-center"> Add Multiple Users </h3>
            <div className="rowContent">
            < AdminNavigation />
            <form className="input-group"
                onSubmit={handleSubmit(this.onSubmit.bind(this))}>

                <button type="button" className="btn btn-primary"
                    onClick={this.incrementUsers.bind(this)}>
                    Add Another
                </button>

                <button type="submit" className="btn btn-primary">
                    Submit</button>

                <Link to={ADMIN_USER} className="btn btn-danger">
                    Return To Users</Link>

                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Password</th>
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
            </div>
        );
    }

    renderUserInputs() {
        return _.map(this.state.entryArray, (entry) => {
            return (
                <tr key={entry}>
                    <td><Field type="text" name={`email${entry}`}
                            component={renderField} /> </td>
                    <td><Field type="text" name={`password${entry}`}
                            component={renderField} /> </td>
                    <td><Field type="text" name={`firstName${entry}`}
                            component={renderField} /> </td>
                    <td><Field type="text" name={`lastName${entry}`}
                            component={renderField} /> </td>
                    <td><Field type="checkbox" name={`access${entry}`}
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
    validate : validateUser,
    form : "PostMultipleNewUsers"
})(
    connect(mapStateToProps, { addUsers })(PostMultipleUsers)
);
