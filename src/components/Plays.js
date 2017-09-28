import React, { Component } from "react";
import { connect } from "react-redux"
import { Link } from "react-router-dom";
import _ from "lodash";
import { fetchPlays } from "./../actions";
import { fetchPlayDetails } from "./../actions";
import { ButtonToolbar, Button, Pagination } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


class Plays extends Component {

    constructor(props) {
        super(props);

        this.options = {
            onPageChange: this.onPageChange.bind(this),
            onSizePerPageList: this.sizePerPageListChange.bind(this)
        };

        this.state = {
            selected_play_id: '59b33f9616df53001221f06c' // make it empty string '' later
        }
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

    sizePerPageListChange(sizePerPage) {
        console.log(`sizePerPage: ${sizePerPage}`);
    }

    onPageChange(page, sizePerPage) {
        console.log(`page: ${page}, sizePerPage: ${sizePerPage}`);
    }

    handleRowSelect(row, isSelected, e) {
        if(isSelected === true) {
            this.setState({ selected_play_id: row._id });
        }
    }

    renderPlaysTable() {
        const plays = _.map(this.props.plays);
        const selectRowProp = {
          mode: 'radio',
          clickToSelect: true,
          onSelect: this.handleRowSelect
        };

        return (
            <BootstrapTable data={plays} pagination={ true } options={ this.options } selectRow={ selectRowProp }>
                <TableHeaderColumn width='150' dataField="title" isKey={true} dataSort={true}>
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
        )

    }

    render() {
        return (
            <div>
                <div className="text-xs-right">
                    <Link className="btn btn-primary" to="play/new">
                        Add New Play
                    </Link>
                </div>
                <Link className="btn btn-primary" to={`/plays/${this.state.selected_play_id}`}>Show Play Details</Link>
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

export default connect(mapStateToProps, { fetchPlays })(Plays);
