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

    constructor(props) {
        super(props);
        
        this.updateTitle = this.updateTitle.bind(this);
        this.updateGenre = this.updateGenre.bind(this);
        this.updateAuthorFirst = this.updateAuthorFirst.bind(this);
        this.updateAuthorLast = this.updateAuthorLast.bind(this);
        this.updateActorCount = this.updateActorCount.bind(this);
        this.updateTimePeriod = this.updateTimePeriod.bind(this);
        this.updateCostumeCount = this.updateCostumeCount.bind(this);
        this.updateSpectacle = this.updateSpectacle.bind(this);
        this.updateCopies = this.updateCopies.bind(this);

    }

    componentDidMount() {
        if (!this.props.play) {
            const { id } = this.props.match.params;
            console.log(id);
            this.props.fetchPlayDetails(id);
        }
        this.state = this.props.play;
    }
    updateTitle(event) {
         console.log(this.props.play);
         this.props.play.title = event.target.value;
    }
    updateGenre(event) {
        this.props.play.genre = event.target.value;
    }
    updateActorCount(event) {
        this.props.play.actorCount = event.target.value;
    }
    updateAuthorFirst(event) {
        this.props.play.authorFirst = event.target.value;
    }
    updateAuthorLast(event) {
        this.props.play.authorLast = event.target.value;
    }
    updateTimePeriod(event) {
        this.props.play.timePeriod = event.target.value;
    }
    updateCostumeCount(event) {
        this.props.play.costumeCount = event.target.value;
    }
    updateSpectacle(event) {
        this.props.play.spectacle = event.target.value;
    }
    updateCopies(event) {
        this.props.play.copies = event.target.value;
    }
    render() {
        const { play } = this.props;
        if (!play) {
            return (<div>Loading Play Content...</div>);
        }
        return (
            <div>
            <p>Title</p>
            <input defaultValue={this.props.play.title} onChange={this.updateTitle}></input><br/>
            <p>Genre</p>
            <input defaultValue={play.genre} onChange={this.updateGenre}></input><br/>
            <p>Actor Count</p>
            <input defaultValue={play.actorCount} onChange={this.updateActorCount}></input><br/>
            <p>Author First Name</p>
            <input defaultValue={play.authorFirst} onChange={this.updateAuthorFirst}></input><br/>
            <p>Author Last Name</p>
            <input defaultValue={play.authorLast} onChange={this.updateAuthorLast}></input><br/>
            <p>Time Period</p>
            <input defaultValue={play.timePeriod} onChange={this.updateTimePeriod}></input><br/>
            <p>Costume Count</p>
            <input defaultValue={play.costumeCount} onChange={this.updateCostumeCount}></input><br/>
            <p>Spectacle</p>
            <input defaultValue={play.hasSpectacle} onChange={this.updateSpectacle}></input><br/>
            <p>Copies</p>
            <input defaultValue={play.copies} onChange={this.updateCopies}></input>
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
