import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { addPlays } from "../../actions";
import { renderField } from "./../../renderers";

class PostPlay extends Component {

    onSubmit(values) {
        const { token } = this.props;
        this.props.addPlays(token, values, () => {
            this.props.history.push("/plays");
        });
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <Field label="Title" type="text" name="title"
                    component={renderField} />
                <Field label="Genre" type="text" name="genre"
                    component={renderField} />
                <Field label="Actor Count" type="text" name="actorCount"
                    component={renderField} />
                <Field label="Author Last Name" type="text" name="authorLast"
                    component={renderField} />
                <Field label="Author First Name" type="text" name="authorFirst"
                    component={renderField} />
                <Field label="Time Period" type="text" name="timePeriod"
                    component={renderField} />
                <Field label="Costume Count" type="text" name="costumeCount"
                    component={renderField} />
                <Field label="Spectacle" type="text" name="hasSpectacle"
                    component={renderField} />
                <Field label="Copies" type="text" name="copies"
                    component={renderField} />
                <button type="submit" className="btn btn-primary">
                    Submit</button>
                <Link to="/play" className="btn btn-danger">
                    Cancel</Link>
            </form>
        );
    }
}


function validate(values) {
    const errors = {};
    if (!values.title) {
            errors.title = "Enter A Title";
    }
    if (!values.genre) {
        errors.genre = "Enter A Genre";
    }
    if (!(values.actorCount - 0)) {
        errors.actorCount = "Enter Number of Actors";
    }
    if (!values.authorLast) {
        errors.authorLast = "Enter Author's Last Name";
    }
    if (!values.authorFirst) {
        errors.authorFirst = "Enter Author's First Name";
    }
    if (!values.timePeriod) {
        errors.timePeriod = "Enter time period";
    }
    if (!(values.costumeCount - 0)) {
        errors.costumeCount = "Enter Number of Costumes";
    }
    if (!values.hasSpectacle) {
        errors.hasSpectacle = "Enter spectacle name or 'false'"
    }
    if (!(values.copies - 0)) {
        errors.copies = "Enter Number of Copies of Script"
    }
    return errors;
}

function mapStateToProps(state) {
    return {
        token : state.currentUser.token
    }
}

export default reduxForm({
   validate : validate,
   form : "PostNewPlay"
})(
connect(mapStateToProps, { addPlays })(PostPlay)
);
