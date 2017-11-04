/* NPM Imports*/
import React, { Component } from "react";
import { connect } from "react-redux"
import { Link } from "react-router-dom";
import _ from "lodash";
import { ButtonToolbar, Button, Pagination, ButtonGroup,
        Col } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

/* Local Imports */
import { fetchPlays, fetchPlayDetails, checkoutPlay, returnPlay, fetchCheckedPlays } from "./../../actions";
import UserNavigation from "./UserNavigation.js";
import "../../../style/style.css";

class UserPlays extends Component {

    constructor(props) {

        super(props);

        this.options = {
            onPageChange: this.onPageChange.bind(this),
            onSizePerPageList: this.sizePerPageListChange.bind(this),
            searchField: this.createCustomSearchField.bind(this)
        };

        this.state = {
            selected_play_id: ''
        }
    }

    componentDidMount() {
        const {access, token} = this.props;
        if (access && token) {
            this.props.fetchPlays(access, token);
            this.props.fetchCheckedPlays(access, token);
        }
    }

    sizePerPageListChange(sizePerPage) {
        console.log(`sizePerPage: ${sizePerPage}`);
    }

    onPageChange(page, sizePerPage) {
        console.log(`page: ${page}, sizePerPage: ${sizePerPage}`);
    }

    handleRowSelect(row, isSelected, e) {
        if(isSelected === true) {
            console.log(row._id);
            this.setState((prevState, props) => ({
                selected_play_id: row._id
            }));
        }
    }

    createCustomSearchField(props) {
        return (
            <SearchField
                className='my-custom-class user-play-search-field'
                placeholder='search'
            />
        );
    }

    checkoutPlay() {
        const {access, token} = this.props;
        const id = this.state.selected_play_id;

        if (access && token && id) {
            this.props.checkoutPlay(access, token, id);
            this.props.fetchPlays(access, token);
            this.props.fetchCheckedPlays(access, token);
        }

        this.props.fetchPlays(access, token);
        this.props.fetchCheckedPlays(access, token);
    }

    returnPlay() {
        const {access, token} = this.props;
        const id = this.state.selected_play_id;

        if (access && token && id) {
            this.props.returnPlay(access, token, id);
            this.props.fetchPlays(access, token);
            this.props.fetchCheckedPlays(access, token);
        }

        this.props.fetchPlays(access, token);
        this.props.fetchCheckedPlays(access, token);
    }

    refresh() {
        const {access, token} = this.props;
        const id = this.state.selected_play_id;

        if (access && token && id) {
            this.props.fetchPlays(access, token);
            this.props.fetchCheckedPlays(access, token);
        }
    }

    renderCheckedPlays() {
        const plays = this.props.plays;
        var checkedPlays = _.map(this.props.checkedPlays);


        console.log(plays);
        // add title, genre, author, time Period as json
        for(var i = 0; i < checkedPlays.length; i++) {

            const curPlay = checkedPlays[i].playID;
            const title = plays[curPlay].title;
            const genre = plays[curPlay].genre;
            const author = plays[curPlay].authorFirst + " " + plays[curPlay].authorLast

            checkedPlays[i].title = title;
            checkedPlays[i].genre = genre;
            checkedPlays[i].author = author;
        }

        const selectRowProp = {
          mode: 'radio',
          clickToSelect: true,
          onSelect: this.handleRowSelect.bind(this)
        };

        return (
            <div>
                <BootstrapTable data={checkedPlays} pagination={ true }
                                options={ this.options }
                                selectRow={ selectRowProp }
                                search>
                    <TableHeaderColumn width='240' dataField="title"
                                        isKey={true} dataSort={true}>
                        Title
                    </TableHeaderColumn>
                    <TableHeaderColumn width='240' dataField="genre">
                        Genre
                    </TableHeaderColumn>
                    <TableHeaderColumn width='240' dataField="author">
                        Author
                    </TableHeaderColumn>
                    <TableHeaderColumn width='240' dataField="date">
                        Checked Date
                    </TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }

    renderPlaysTable() {
        const plays = _.map(this.props.plays);
        const selectRowProp = {
          mode: 'radio',
          clickToSelect: true,
          onSelect: this.handleRowSelect.bind(this)
        };

        return (
            <div>
                <BootstrapTable data={plays} pagination={ true }
                                options={ this.options }
                                selectRow={ selectRowProp }
                                search>
                    <TableHeaderColumn width='150' dataField="title"
                                        isKey={true} dataSort={true}>
                        Title
                    </TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField="genre">
                        Genre
                    </TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField="actorCount">
                        Actor Count
                    </TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField="authorLast">
                        Author
                    </TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField="timePeriod">
                        Time Period
                    </TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField="costumeCount">
                        Costume Count
                    </TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField="hasSpectacle">
                        hasSpectacle
                    </TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField="copies">
                        copies
                    </TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }


    render() {
        return (
            <div className="play-div-custom-padding">
                <h3 className="text-center">
                    Student Play Selection
                </h3>
                <ButtonToolbar className="user-play-ButtonToolbar">
                    <ButtonGroup bsSize="small">
                        <Link className="btn btn-primary button-custom-size-120 button-custom-margin5" to={`/student/plays/${this.state.selected_play_id}`}>
                            Show Play Details
                        </Link>
                    </ButtonGroup>
                    <ButtonGroup bsSize="small">
                        <button className="btn btn-primary button-custom-size-120 button-custom-margin5" onClick={this.checkoutPlay.bind(this)}>
                            Checkout Play
                        </button>
                    </ButtonGroup>
                    <ButtonGroup bsSize="small">
                        <button className="btn btn-primary button-custom-size-120 button-custom-margin5" onClick={this.refresh.bind(this)}>
                            Refresh
                        </button>
                    </ButtonGroup>
                </ButtonToolbar>
                <div>
                    {this.renderPlaysTable()}
                </div>
                <div>
                    <h3 className="text-center">
                        Checked Plays
                    </h3>
                    <ButtonToolbar className="user-play-ButtonToolbar">
                        <ButtonGroup bsSize="small">
                            <button className="btn btn-primary button-custom-size-120 button-custom-margin5" onClick={this.returnPlay.bind(this)}>
                                Return Play
                            </button>
                        </ButtonGroup>
                        <ButtonGroup bsSize="small">
                            <button className="btn btn-primary button-custom-size-120 button-custom-margin5" onClick={this.refresh.bind(this)}>
                                Refresh
                            </button>
                        </ButtonGroup>
                    </ButtonToolbar>
                    {this.renderCheckedPlays()}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {

    console.log(state);

    return {
        access : state.currentUser.access,
        token : state.currentUser.token,
        plays : state.plays,
        checkedPlays : state.checkedPlays
    };
}

export default connect(mapStateToProps,{ fetchPlays, checkoutPlay, returnPlay, fetchCheckedPlays })(UserPlays);
