/* NPM Imports*/
import React, { Component } from "react";
import { connect } from "react-redux"
import { Link } from "react-router-dom";
import _ from "lodash";
import { ButtonToolbar, Button, Pagination, ButtonGroup,
        Col } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

/* Local Imports */
import { fetchPlays, fetchPlayDetails, checkoutPlay, fetchCheckedPlays } from "./../../actions";
import UserNavigation from "./UserNavigation.js";
import "../../../style/style.css";

class UserPlays extends Component {

    constructor(props) {

        super(props);

        this.options = {
            onPageChange: this.onPageChange.bind(this),
            onSizePerPageList: this.sizePerPageListChange.bind(this),
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

    checkout() {
        const {access, token} = this.props;
        const id = this.state.selected_play_id;

        if (access && token && id) {

            console.log(access);
            console.log(token);
            console.log(id);

            this.props.checkoutPlay(access, token, id);
            this.props.fetchPlays(access, token);
            this.props.fetchCheckedPlays(access, token);
        }
    }

    renderCheckedPlays() {
        const plays = _.map(this.props.checkedPlays);
        const selectRowProp = {
          mode: 'radio',
          clickToSelect: true,
          onSelect: this.handleRowSelect.bind(this)
        };

        return (
            <div className="rowContent">
                <UserNavigation />
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

    renderPlaysTable() {
        const plays = _.map(this.props.plays);
        const selectRowProp = {
          mode: 'radio',
          clickToSelect: true,
          onSelect: this.handleRowSelect.bind(this)
        };

        return (
            <div className="rowContent">
                <UserNavigation />
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
                <ButtonToolbar className="play-ButtonToolbar">
                    <ButtonGroup bsSize="small">
                        <Link className="btn btn-primary button-custom-size-120 button-custom-margin5" to={`/student/plays/${this.state.selected_play_id}`}>
                            Show Play Details
                        </Link>
                    </ButtonGroup>
                    <ButtonGroup bsSize="small">
                        <button className="btn btn-primary button-custom-size-120 button-custom-margin5" onClick={this.checkout.bind(this)}>
                            Checkout Play
                        </button>
                    </ButtonGroup>
                </ButtonToolbar>
                <div style={{padding: 60}}>
                    {this.renderPlaysTable()}
                </div>
                <div style={{padding: 60}}>
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

export default connect(mapStateToProps,{ fetchPlays, checkoutPlay, fetchCheckedPlays })(UserPlays);
