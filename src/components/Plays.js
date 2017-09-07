import _ from 'lodash';
import fetchPlays from '../actions/index.js'
import React, { Component } from "react";
import { connect } from 'react-redux'

class Plays extends Component {

    componentDidMount() {
        this.props.fetchPlays();
    }
    renderPlays() {
        console.log("rendering plays");
        console.log(this.props.plays)
        _.map(this.props.plays, play => {
            console.log(play.title);
            return (
                <li key={play._id}>
                {play.title}
                </li>
            );
        });
    }
    render() {
        return (
            <div>
                <h3>This is the Plays page</h3>
                <ul className='list-group'>
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
