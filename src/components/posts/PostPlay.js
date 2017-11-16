/* NPM Imports */
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

/* Local Imports */
import { AdminNavigation } from "./../admin";
import { validatePlay } from "./utils";
import { addPlays } from "../../actions";
import { renderField, renderTextArea } from "./../../renderers";
import { ADMIN_PLAY } from "./../paths";

class PostPlay extends Component {

    onSubmit(values) {
        const { token } = this.props;
        this.props.addPlays(token, values, () => {
            this.props.history.push(ADMIN_PLAY);
        });
    }

    render() {
        const { handleSubmit } = this.props;

        return (
            <div>
            <h3 className="text-center"> Add A New Play </h3>
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
                <Field label="Summary & Comments" type="text" name="comments"
                    component={renderTextArea}/>
                <button type="submit" className="btn btn-primary">
                    Submit</button>
                <Link to={ADMIN_PLAY} className="btn btn-danger">
                    Return To Plays</Link>
            </form>
            </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        token : state.currentUser.token
    }
}

export default reduxForm({
   validate : validatePlay,
   form : "PostNewPlay"
})(
connect(mapStateToProps, { addPlays })(PostPlay)
);
