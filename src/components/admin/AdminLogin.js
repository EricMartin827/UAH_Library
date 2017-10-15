/* NPM Imports */
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Form, FormGroup, Col, Checkbox, Button } from "react-bootstrap";

/* Local Imports */
import { loginUser } from "./../../actions";
import { renderField } from "./../../renderers";
import { REGISER, ADMIN_PLAYS } from "./../paths";


class AdminLogin extends Component {

    onSubmit(values) {
        values.access = "admin";
        this.props.loginUser(values,
            () => this.props.history.push(REGISTER),
            () => this.props.history.push(ADMIN_PLAYS));
    }

    render() {

        /* Passed to this.props by redux from */
        const { handleSubmit } = this.props;
        const localStyles = {maxWidth: 400, margin: '0 auto 10px'};

        return (
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}
                    style={localStyles}>

            <FormGroup>
                <Col sm={10}>
                    Email
                </Col>
                <Col xs={6} md={10}>
                    <Field type="text" name="email"
                            component={renderField} />
                </Col>
            </FormGroup>

            <FormGroup>
                <Col sm={10}>
                    Password
                </Col>
                <Col xs={6} md={10}>
                    <Field type="text" name="password"
                            component={renderField} />
                </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={4} sm={10}>
                <Checkbox>Remember me</Checkbox>
              </Col>
            </FormGroup>

            <FormGroup>
                <Col smOffset={4} sm={10}>
                    <button type="submit" className="btn btn-primary">
                        Login</button>
                    <Link to="/" className="btn btn-danger">
                        Cancel</Link>
                </Col>
            </FormGroup>

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
    connect(null, { loginUser })(AdminLogin)
);
