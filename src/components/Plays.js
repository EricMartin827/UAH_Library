import React, { Component } from "react";
import { connect } from "react-redux"
import _ from "lodash";
import { fetchPlays } from "./../actions";
import { ButtonToolbar, Button, Pagination } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class Plays extends Component {

    constructor(props) {
      super(props);

      this.options = {
        onPageChange: this.onPageChange.bind(this),
        onSizePerPageList: this.sizePerPageListChange.bind(this)
      };
    }

    componentDidMount() {
        this.props.fetchPlays();
    }

    sizePerPageListChange(sizePerPage) {
    //   alert(`sizePerPage: ${sizePerPage}`);
    }

    onPageChange(page, sizePerPage) {
    //   alert(`page: ${page}, sizePerPage: ${sizePerPage}`);
    }

    renderPlaysTable() {
        const plays = _.map(this.props.plays);
        const selectRowProp = {
          mode: 'checkbox',
          clickToSelect: true
        };

        return (
            <BootstrapTable data={plays} pagination={ true } options={ this.options } selectRow={ selectRowProp }>
                <TableHeaderColumn width='150' dataField="title" isKey={true} dataSort={true}>
                    Title
                </TableHeaderColumn>
                <TableHeaderColumn width='150' dataField="genre">
                    Genre
                </TableHeaderColumn>
                <TableHeaderColumn  width='150' dataField="actorCount">
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
                <ButtonToolbar>
                <Button bsStyle="success" bsSize="small" active>
                    Display Detail
                </Button>
                </ButtonToolbar>
                {this.renderPlaysTable()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {plays: state.plays };
}

export default connect(mapStateToProps, { fetchPlays })(Plays);
