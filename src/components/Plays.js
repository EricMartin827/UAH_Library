import React, { Component } from "react";
import { connect } from "react-redux"
import { Link } from "react-router-dom";
import _ from "lodash";

import { fetchPlays } from "./../actions";

class Plays extends Component {

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        const { access, token } = nextProps;
        if (access != this.props.access || token != this.props.token) {
            this.props.fetchPlays(access, token);
        }
    }

    renderPlays() {
        return _.map(this.props.plays, play => {
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
        });
    }

    render() {
        return (
            <div>
                <div className="text-xs-right">
                    <Link className="btn btn-primary" to="/users">
                        Users Page
                        </Link>
                </div>
                <h3>This is the Plays page</h3>
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
                    {this.renderPlays()}
                    </tbody>
                </table>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        access : state.currentUser.access,
        token : state.currentUser.token,
        plays : state.plays
    };
}

export default connect(mapStateToProps, { fetchPlays })(Plays);
