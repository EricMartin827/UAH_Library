/* NPM Imports */
import React, { Component } from "react";
import { connect } from "react-redux";
import { queryUsers } from "./../actions";

class SearchBar extends Component {

    /* Set up inital state of search bar. */
    constructor(props) {
        super(props);
        this.state = {term : ""};
        this.onInputChange = this.onInputChange.bind(this);
    }

    onInputChange(event) {
        this.setState({ term : event.target.value })
    }

    onFormSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <div className="search-bar-padding">
            <form onSubmit={this.onFormSubmit} className="input-group">
            <input
                placeholder="Enter First Name of User"
                className="form-control"
                value={this.state.term}
                onChange={this.onInputChange}/>
            <span className="input-group-btn">
                <button type="submit" className="btn btn-secondary">
                    Submit
                </button>
            </span>
            </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {user: state.user};
}

export default connect(mapStateToProps, { queryUsers })(SearchBar);
