import _ from 'lodash';
import fetchPlayDetails from '../actions/index.js'
import React, { Component } from "react";
import { connect } from 'react-redux'

class Play_Details extends Component {

    onSubmit(id) {
        this.props.fetchPlayDetails(id);
    }

    renderPlayDetails() {
        console.log("rendering play details");
        console.log(this.props.play_details)
        return _.map(this.props.play_details, play_details => {
            console.log(play_details.title);
            return (
                <tr key={play_details._id}>
                    <td>{play_details.title}</td>
                    <td>{play_details.genre}</td>
                    <td>{play_details.actorCount}</td>
                    <td>{play_details.authorLast}, {play_details.authorFirst}</td>
                    <td>{play_details.timePeriod}</td>
                    <td>{play_details.costumeCount}</td>
                    <td>{play_details.hasSpectacle + ""}</td>
                    <td>{play_details.copies}</td>
                </tr>
            );
        });
    }

    render() {
        return (
            <div>
                <h3>This is the play details page</h3>
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
                    {this.renderPlayDetails()}
                    </tbody>
                </table>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {play_details: state.play_details };
}

export default connect(mapStateToProps, {fetchPlayDetails: fetchPlayDetails})(Play_Details);
