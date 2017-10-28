/* NPM Imports*/
import React, { Component } from "react";
import { connect } from "react-redux"
import { Link } from "react-router-dom";
import _ from "lodash";
import { ButtonToolbar, Button, Pagination, ButtonGroup,
        Col } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

/* Local Imports */
import { fetchPlays, fetchPlayDetails, checkoutPlay } from "./../../actions";
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

    checkoutPlay() {
        console.log(this.state.selected_play_id);

        this.props.checkoutPlay(this.state.selected_play_id);

        const {access, token} = this.props;
        const id = this.state.selected_play_id;

        //console.log(id);

        if (access && token && id) {
            this.props.checkoutPlay(access, token, id);
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
            <div className="rowContent">
                <UserNavigation />
                <BootstrapTable data={plays} pagination={ true }
                                options={ this.options }
                                selectRow={ selectRowProp }>
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
                        <button className="btn btn-primary button-custom-size-120 button-custom-margin5" onClick={this.checkoutPlay.bind(this)}>
                            Checkout Play
                        </button>
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

export default connect(mapStateToProps,{ fetchPlays, checkoutPlay })(UserPlays);
