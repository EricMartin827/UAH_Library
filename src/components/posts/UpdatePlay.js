/* NPM Imports */
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

/* Local Imports */
import { AdminNavigation } from "./../admin";
import { validatePlay } from "./utils";
import { updatePlay, fetchPlayDetails } from "../../actions";
import { renderField } from "./../../renderers";
import { ADMIN_PLAY } from "./../paths";

class UpdatePlay extends Component {

    onSubmit(values) {
        const { token } = this.props;
        const { play } = this.props;
        this.props.updatePlay(token, values, play._id, () => {
            this.props.history.push(ADMIN_PLAY);
        });
    }

    render() {

        const { handleSubmit } = this.props;
        return (
            <div>
            <h3 className="text-center"> Update A Play </h3>
            <div className="rowContent">
            <AdminNavigation />
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}
                    className="postplay-form-custom-padding"
                    style={{width: "90%"}}>
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
                <Link to={ADMIN_PLAY} className="btn btn-danger">
                    Return To Plays</Link>
            </form>
            </div>
            </div>
        );
    }

    componentDidMount() {
        const { play } = this.props;
        if (play) {
            const { initialValues } = this.props;
            initialValues.title = play.title;
            initialValues.authorFirst = play.authorFirst;
            initialValues.authorLast = play.authorLast;
            initialValues.genre = play.genre;
            initialValues.costumeCount  = play.costumeCount;
            initialValues.actorCount = play.actorCount;
            initialValues.hasSpectacle = play.hasSpectacle;
            initialValues.timePeriod = play.timePeriod;
            initialValues.copies = play.copies;
        }
    }
}

function mapStateToProps(state, ownProps) {
    return {
        access : state.currentUser.access,
        token : state.currentUser.token,
        play : state.plays[ownProps.match.params.id]
    };
}

export default reduxForm({
    validate : validatePlay,
    enableReinitialize : true,
    keepDirtyOnReinitialize : true,
    initialValues : {
        title : "Loading",
        genre : "Loading",
        authorFirst : "Loading",
        authorLast : "Loading",
        actorCount : "Loading",
        timePeriod : "Loading",
        costumeCount : "Loading",
        hasSpectacle : "Loading",
        copies : "Loading"
    },
    form : "UpdatePlayFrom"
})(
connect(mapStateToProps, { fetchPlayDetails, updatePlay })
(UpdatePlay));
