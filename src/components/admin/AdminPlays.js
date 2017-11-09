/* NPM Imports*/
import React, { Component } from "react";
import { connect } from "react-redux"
import { Link } from "react-router-dom";
import _ from "lodash";
import { ButtonToolbar, Button, Pagination, ButtonGroup,
        Col } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn,
        DeleteButton } from 'react-bootstrap-table';

/* Local Imports */
import { fetchPlays, removePlayById, fetchPlayDetails } from "./../../actions";
import AdminNavigation from "./AdminNavigation.js";
import "../../../style/style.css";

class AdminPlays extends Component {

    constructor(props) {

        super(props);

        this.options = {
            onPageChange: this.onPageChange.bind(this),
            onSizePerPageList: this.sizePerPageListChange.bind(this),
            afterDeleteRow: this.handleDeletedRow.bind(this),
            deleteBtn: this.createCustomDeleteButton.bind(this),
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
        }
    }

    renderPlays() {
        return _.map(this.props.plays, play => {
            return (
                <tr key={play._id}>
                    <input value={play.title}></input>
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
                className='my-custom-class play-search-field'
                placeholder='search'
            />
        );
    }

    createCustomDeleteButton(onClick) {
        return (
          <DeleteButton
            btnText='Delete Play'
            btnContextual='btn-warning'
            className='my-custom-class button-custom-size-150 button-custom-margin10'
            onClick={ () => this.handleDeletedRow(onClick) }
          />
        );
    }

    handleDeletedRow() {
        this.removePlay(this.props.token, this.state.selected_play_id);
    }

    removePlay(token, id) {
        this.props.removePlayById(
            token,
            id
        );

        this.setState((prevState, props) => ({
            selected_play_id: ''
        }));

        const {access} = this.props;
        if (access) {
            this.props.fetchPlays(access, token);
        }
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
                <div className="play-AdminNavigation-div">
                    <AdminNavigation />
                </div>
                <div className="play-table-div">
                    <BootstrapTable data={plays} pagination={ true }
                                    options={ this.options }
                                    selectRow={ selectRowProp }
                                    deleteRow search>
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
            </div>
        )
    }

    render() {
        return (
            <div className="play-div-custom-padding">
                <h3 className="text-center">
                    Admin Home
                </h3>
                <ButtonToolbar className="play-ButtonToolbar">
                    <ButtonGroup bsSize="small">
                        <Link className="btn btn-primary button-custom-size-120 button-custom-margin5" to={`/admin/plays/${this.state.selected_play_id}`}>
                            Show Play Details
                        </Link>
                    </ButtonGroup>
                </ButtonToolbar>
                {this.renderPlaysTable()}
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

export default connect(mapStateToProps,
        {fetchPlays, removePlayById })(AdminPlays);
