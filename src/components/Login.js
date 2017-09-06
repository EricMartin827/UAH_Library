/* NPM Imports */
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

/* Local Imports */
import { loginUser } from "./../actions";
import { renderField } from "./../renderers";

class Login extends Component {

    onSubmit(values) {
            console.log("Login onSubmit Values: ", values);
            this.props.loginUser(values, () => {
                this.props.history.push("/plays");
            })
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
            <button type="submit" className="btn btn-primary">
                Login</button>
            <Link to="/" className="btn btn-danger">
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
    return errors;
}


export default reduxForm({
    validate : validate,
    form : "LoginUser"
})(
    connect(null, { loginUser })(Login)
);
