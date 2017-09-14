/* NPM Imports */
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

/* Local Imports */
import { addUsers } from "./../../actions";
import { renderField } from "./../../renderers";

class PostUser extends Component {

    onSubmit(values) {
        this.props.addUsers(values, () => {
            this.props.history.push("/users");
        });
    }

    render() {

        /* Passed to this.props by redux from */
        const { handleSubmit } = this.props;

        return (
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <Field label="Email" type="text" name="email"
                    component={renderField} />
                <Field label="Password" type="text" name="password"
                    component={renderField} />
                <Field label="First Name" type="text" name="firstName"
                    component={renderField} />
                <Field label="Last Name" type="text" name="lastName"
                    component={renderField} />
                <button type="submit" className="btn btn-primary">
                    Submit</button>
                <Link to="/user" className="btn btn-danger">
                    Cancel</Link>
            </form>
        );
    }
}


/* Will Improve This: Will Need To Add Query To Database */
function validate(values) {

    const errors = {};

    if (!values.email) {
        errors.email = "Enter An Email";
    }

    if (!values.password) {
        errors.password = "Enter A Password";
    }

    if (!values.firstName) {
        errors.firstName = "Enter A First Name";
    }

    if (!values.lastName) {
        errors.lastName = "Enter A Last Name";
    }

    return errors;
}


export default reduxForm({
    validate : validate,
    form : "PostNewUser"
})(
    connect(null, { addUsers })(PostUser)
);