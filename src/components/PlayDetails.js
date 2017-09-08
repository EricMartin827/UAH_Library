import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";

import { fetchPlayDetails } from "./../actions";


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

        return (
            <div>
                <Link className="btn btn-primary" to="/plays">Back To Plays</Link>
                <h3>Play Details Page</h3>
                <table className='list-group'>
                    <tbody>
                    <tr>
                        <td>Title</td>
                        <td>Genre</td>
                        <td>Actor Count</td>
                        <td>Author</td>
                        <td>Time Period</td>
                        <td>Costume Count</td>
                        <td>Spectacle?</td>
                        <td>Copies</td>
                    </tr>
                    {this.renderPlayDetails(play)}
                    </tbody>
                </table>
            </div>
        );
    }

    renderPlayDetails(play) {
        return (
            <tr key={play._id}>
                <td> <Link to={`/plays/${play._id}`}>
                    {play.title}
                </Link></td>
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

function mapStateToProps( { plays }, ownProps) {
    return { play : plays[ownProps.match.params.id] }
}

export default connect(mapStateToProps, { fetchPlayDetails })(PlayDetails);
