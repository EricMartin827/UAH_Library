import React, {Component} from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import {addPlay} from "../../actions";
import { renderField } from "./../../renderers";

class PostPlay extends Component {
    onSubmit(values) {
        this.props.addPlay(values, () => {
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
    //TODO: validate input
    return {}
}

export default reduxForm({
   validate : validate,
   form : "PostNewPlay"
})(
connect(null, { addPlay })(PostPlay)
);
