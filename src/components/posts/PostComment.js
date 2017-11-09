/* NPM Imports */
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

/* Local Imports */
import { AdminNavigation } from "./../admin";
import { addComment } from "../../actions";
import { renderField } from "./../../renderers";
import { ADMIN_COMMENT } from "./../paths";

class PostComment extends Component {

    onSubmit(values, playId) {
        const { token } = this.props;
        this.props.addComment(token, values, () => {
            this.props.history.push(ADMIN_COMMENT);
        });
    }

    render() {
        const { handleSubmit } = this.props;

        return (
            <div>
            <h3 className="text-center"> Add A New Comment </h3>
            <div className="rowContent">
            <AdminNavigation />
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}
                    className="postcomment-form-custom-padding"
                    style={{width: "90%"}}>
                <Field label="Comment" type="text" name="comment"
                    component={renderField} />
                <button type="submit" className="btn btn-primary">
                    Submit</button>
                <Link to={ADMIN_COMMENT} className="btn btn-danger">
                    View Comments on Play</Link>
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
   form : "PostNewComment"
})(
connect(mapStateToProps, { addComment })(PostComment)
);
