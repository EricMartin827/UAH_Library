import React, { Component } from "react";
import { connect } from "react-redux"
import _ from "lodash";

import { fetchPlays } from "./../actions";
import NavList from './nav-list';

class Plays extends Component {

    componentDidMount() {
        this.props.fetchPlays();
    }

    renderPlays() {
        return _.map(this.props.plays, play => {
            console.log(play);
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
                <h3>This is the Plays page</h3>
                <div>
                    <div>
                        <NavList />
                    </div>
                    <br />
                    <br /> 
                    <div>
                        <form>
                            Author Search <input name="authorsearch" type="text"></input> Title Search <input name="titleSearch" type="text"></input> Number of Actors <input name="actors" type="number"></input><br />
                            Has Spectacle? <input type="radio" name="hasspectacle" value="1"></input> Yes <input type="radio" name="hasspectacle" value="0"></input> No <input name="search" type="submit" value="Search"></input> <br /> <br />
                        </form>
                    </div>
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
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {plays: state.plays };
}

export default connect(mapStateToProps, { fetchPlays })(Plays);
