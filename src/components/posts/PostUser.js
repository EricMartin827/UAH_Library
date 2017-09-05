import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { addUsers } from "./../../actions";

class PostUser extends Component {

    render() {

        /* Passed to this.props by redux from */
        const { handleSubmit } = this.props;

        return (
            <form onSubmit={handleSubmit(submit.bind(this))}>
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

function submit(values) {

    this.props.addUsers(values, () => {
        this.props.history.push("/users");
    });
}

function renderField(field) {
    const { meta : { touched, error } } = field;
    const className = `form-group ${(touched && error) ? "has-danger" : ""}`;
    return (
        <div className={className}>
            <label>{field.label}</label>
            <input className="form-control" type={field.type}
                {...field.input} />
            <div className="text-help">
                {touched ? error : ""}
            </div>
        </div>
    );
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
    form : "PostNewUser" /* This String Must Be Unique to Not Share State !! */
})(
    connect(null, { addUsers })(PostUser)
);
