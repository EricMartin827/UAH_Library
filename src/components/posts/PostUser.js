/* NPM Imports */
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

/* Local Imports */
import { validateUser } from "./utils";
import { addUsers } from "./../../actions";
import { renderField } from "./../../renderers";
import { AdminNavigation } from ".././navigation/adminNavigation.js";

class PostUser extends Component {

    onSubmit(values) {
        const { token } = this.props;
        values.access = (values.access) ? "admin" : "user";
        this.props.addUsers(token, values, () => {
            this.props.history.push("/users");
        });
    }

    render() {

        const { handleSubmit } = this.props;

        return (
            <div className="rowContent">
            <AdminNavigation />
            <form  className="input-group"
                onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <Field label="Email" type="text" name="email"
                    component={renderField} />
                <Field label="Password" type="text" name="password"
                    component={renderField} />
                <Field label="First Name" type="text" name="firstName"
                    component={renderField} />
                <Field label="Last Name" type="text" name="lastName"
                    component={renderField} />
                <Field label="Faculty" type="checkbox" name="access"
                    value="admin" component={renderField} />
                <button type="submit" className="btn btn-primary">
                    Submit</button>
                <Link to="/user" className="btn btn-danger">
                    Cancel</Link>
            </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        token : state.currentUser.token,
    }
}

export default reduxForm({
    validate : validateUser,
    form : "PostNewUser"
})(
    connect(mapStateToProps, { addUsers })(PostUser)
);
