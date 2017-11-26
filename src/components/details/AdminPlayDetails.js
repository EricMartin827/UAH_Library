import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";
import { Media } from 'react-bootstrap';

import { fetchPlayDetails } from "./../../actions";
import { ADMIN_PLAY, ADMIN_UPDATE_PLAY } from "./../paths";

class AdminPlayDetails extends Component {

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
                    to={ADMIN_PLAY}>
                    Back To Plays</Link>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Link className="btn btn-primary"
                    to={`${ADMIN_UPDATE_PLAY}/${id}`}>
                    Update</Link>
                        <br />
                <div className="play-details-container">
                    <div className="play-title">
                       <h1><center>{play.title}</center></h1>
                    </div>

                    <div className="play-details-navigation-and-information">
                        <div className="play-details-genre">
                            <center>
                                <b> Genre: </b>
                                <br /> {play.genre}
                            </center>
                        </div>
                        <div className="play-details-actor-count">
                            <center>
                                <b> Actor Count: </b>
                                <br /> {play.actorCount}
                            </center>
                        </div>
                        <div className="play-details-author">
                            <center>
                                <b> Author: </b>
                                <br /> {play.authorLast}, {play.authorFirst}
                            </center>
                        </div>
                        <div className="play-details-time-period">
                            <center>
                                <b> Time Period: </b>
                                <br /> {play.timePeriod}
                            </center>
                        </div>
                        <div className="play-details-costume-count">
                            <center>
                                <b> Costume Count: </b>
                                <br /> {play.costumeCount}
                            </center>
                        </div>
                        <div className="play-details-has-spectacle">
                            <center>
                                <b> Has Spectacle: </b>
                                <br /> {play.hasSpectacle + ""}
                            </center>
                        </div>
                        <div className="play-details-copies">
                            <center>
                                <b> Number of copies: </b>
                                <br /> {play.copies}
                            </center>
                        </div>
                    </div>
                    <div className="play-details-decription">
                        <Media.Body>
                            <Media.Heading>Summary & Comments </Media.Heading>
                            <p>{play.comments}</p>
                        </Media.Body>
                    </div>
                </div>

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

export default connect(mapStateToProps, { fetchPlayDetails })(AdminPlayDetails);
