import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";


import { fetchPlayDetails } from "./../../actions";

import { Media } from 'react-bootstrap';


class PlayDetails extends Component {

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

        const {access} = this.props;
        const trimed_access = access.replace(/^\s+|\s+$/g,"");
        const URL = '/'+ trimed_access + '/plays';

        return (
            <div className="play-div-custom-padding">
                <Link className="btn btn-primary" to={URL}>Back To Plays</Link>
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
                                    <Media.Heading>Abstract</Media.Heading>
                                        <p>The Tragedy of Hamlet, Prince of Denmark, often shortened to Hamlet (/ˈhæmlɪt/), is a tragedy written by William Shakespeare at an uncertain date between 1599 and 1602. Set in Denmark, the play dramatises the revenge Prince Hamlet is called to wreak upon his uncle, Claudius, by the ghost of Hamlet's father, King Hamlet. Claudius had murdered his own brother and seized the throne, also marrying his deceased brother's widow.

Hamlet is Shakespeare's longest play, and is considered among the most powerful and influential works of world literature, with a story capable of "seemingly endless retelling and adaptation by others".[1] The play likely was one of Shakespeare's most popular works during his lifetime,[2] and still ranks among his most performed, topping the performance list of the Royal Shakespeare Company and its predecessors in Stratford-upon-Avon since 1879.[3] It has inspired many other writers—from Johann Wolfgang von Goethe and Charles Dickens to James Joyce and Iris Murdoch—and has been described as "the world's most filmed story after Cinderella".[4]

The story of Shakespeare's Hamlet was derived from the legend of Amleth, preserved by 13th-century chronicler Saxo Grammaticus in his Gesta Danorum, as subsequently retold by 16th-century scholar François de Belleforest. Shakespeare may also have drawn on an earlier (hypothetical) Elizabethan play known today as the Ur-Hamlet, though some scholars believe he himself wrote the Ur-Hamlet, later revising it to create the version of Hamlet we now have. He almost certainly wrote his version of the title role for his fellow actor, Richard Burbage, the leading tragedian of Shakespeare's time. In the 400 years since its inception, the role has been performed by numerous highly acclaimed actors in each successive century.

Three different early versions of the play are extant: the First Quarto (Q1, 1603); the Second Quarto (Q2, 1604); and the First Folio (F1, 1623). Each version includes lines and entire scenes missing from the others. The play's structure and depth of characterisation have inspired much critical scrutiny. One such example is the centuries-old debate about Hamlet's hesitation to kill his uncle, which some see as merely a plot device to prolong the action, but which others argue is a dramatisation of the complex philosophical and ethical issues that surround cold-blooded murder, calculated revenge, and thwarted desire. More recently, psychoanalytic critics have examined Hamlet''s unconscious desires, while feminist critics have re-evaluated and attempted to rehabilitate the often maligned characters of Ophelia and Gertrude.</p>

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

export default connect(mapStateToProps, { fetchPlayDetails })(PlayDetails);
