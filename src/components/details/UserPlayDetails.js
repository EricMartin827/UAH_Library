import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";
import { Media } from 'react-bootstrap';


import { fetchPlayDetails } from "./../../actions";
import { USER_PLAY } from "./../paths";

class UserPlayDetails extends Component {

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

        const { id } = this.props.match.params;
        const {access} = this.props;
        return (
            <div className="play-div-custom-padding">
                <Link className="btn btn-primary"
                    to={USER_PLAY}>
                    Back To Plays</Link>
                <Media className="play-div-custom-padding">
                    <Media.Body>
                        <Media.Heading>{play.title}</Media.Heading>
                            <br/>
                            <p>Genre: {play.genre}</p>
                            <p>Actor Count: {play.actorCount}</p>
                            <p>Author: {play.authorLast}, {play.authorFirst}</p>
                            <p>Time Period: {play.timePeriod}</p>
                            <p>Costume Count: {play.costumeCount}</p>
                            <p>Spectacle: {play.hasSpectacle + ""}</p>
                            <p>Copies: {play.copies}</p>
                                <Media.Body>
                                    <Media.Heading>Abstract</Media.Heading>
                                    <p>{play.comments}</p>
                                </Media.Body>
                        </Media.Body>
                    </Media>
            </div>
        );
    }

    renderPlayDetails(play) {
        return (
            <tr key={play._id}>
                <td>{play.title}</td>
                <td>{play.genre}</td>
                <td>{play.actorCount}</td>
                <td>{play.authorLast}, {play.authorFirst}</td>
                <td>{play.timePeriod}</td>
                <td>{play.costumeCount}</td>
                <td>{play.hasSpectacle + ""}</td>
                <td>{play.copies}</td>
            </tr>
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

export default connect(mapStateToProps, { fetchPlayDetails })(UserPlayDetails);
