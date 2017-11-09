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

    componentDidMount() {
        if (!this.props.play) {
            const { id } = this.props.match.params;
            this.props.fetchPlayDetails(id);
        }
    }
    render() {
        const { play } = this.props;

        if (!play) {
            return (<div>Loading Play Content...</div>);
        }
        return (
            <div>
            <p>{play.title}</p><br/>
            <p>{play.genre}</p><br/>
            <p>{play.actorCount}</p><br/>
            <p>{play.timePeriod}</p><br/>
            <p>{play.costumeCount}</p><br/>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        access : state.currentUser.access,
        token : state.currentUser.token,
        play : state.plays[ownProps.match.params.id]
    };
}

export default connect(mapStateToProps, {fetchPlayDetails})(UpdatePlay);
