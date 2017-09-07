import _ from 'lodash';
import fetchPlays from '../actions/index.js'
import React, { Component } from "react";
import { connect } from 'react-redux'

class Plays extends Component {

    componentDidMount() {
        console.log(this.props);
        this.props.fetchPlays();
    }
    renderPlays() {
        console.log("rendering plays");
        _.map(this.props.plays, play => {
            return (
                <li key={play.id}>
                {play.title}
                </li>
            );
        });
    }
    render() {
        return (
            <div>
                <h3>This is the Plays page</h3>
                <ul>
                    {this.renderPlays()}
                </ul>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {plays: state.plays };
}

export default connect(mapStateToProps, {fetchPlays: fetchPlays})(Plays);
