/* NPM Imports */
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";

/* Local Imports */
import { registerUser } from "./../actions";
import { renderField } from "./../renderers";
import { ADMIN_PLAY, USER_PLAY } from "./paths";

class Register extends Component {

    onSubmit(values) {
        const { currentUser } = this.props;
        this.props.registerUser(values.newPassword, currentUser.token,
            () => this.props.history.push(USER_PLAY),
            () => this.props.history.push(ADMIN_PLAY));
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <Field label="New Password" type="password"
                    name="newPassword" component={renderField} />
                <Field label="Confirm Password" type="password"
                    name="matchingPassword" component={renderField} />
                <button type="submit" className="btn btn-primary">
                    Submit</button>
            </form>
        );
    }
}

function validate(values) {

    //const { currentUser } = this.props;

    const errors = {};

    if (!values.newPassword) {
        errors.newPassword = "Enter A New Password";
    }

    if (values.matchingPassword !== values.newPassword) {
        errors.matchingPassword = "Desired Passwords Do Not Match";
    }

    return errors;
}

function mapStateToProps(state) {
    return { currentUser : state.currentUser }
}

export default reduxForm({
    validate : validate,
    form : "RegisterUser"
})(
    connect(mapStateToProps, { registerUser })(Register)
);
