/* NPM Imports */
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";

/* Local Imports */
import { validatePlay, processPlayArrayForm } from "./utils";
import { addPlays } from "./../../actions";
import { renderField } from "./../../renderers";
import { AdminNavigation } from "./../admin";
import { ADMIN_PLAY } from "./../paths";

class PostMultiplePlays extends Component {

    constructor(props) {
        super(props);
        this.state = {entryArray : [ 0 ] };
    }

    incrementPlays() {
        const arr = this.state.entryArray;
        this.setState({entryArray : arr.concat([arr.length])});
    }

    onSubmit(values) {
        const { token } = this.props;
        this.props.addPlays(token, processPlayArrayForm(values),
            () => {this.props.history.push(ADMIN_PLAY)});
    }

    render() {

        const { handleSubmit } = this.props;

        return (

            <div className="postmultipleplays-div-custom-padding">
            <h3 className="text-center"> Add Multiple Plays </h3>
            <div className="rowContent">
            < AdminNavigation />
            <form className="input-group"
                onSubmit={handleSubmit(this.onSubmit.bind(this))}>

                <button type="button" className="btn btn-primary"
                    onClick={this.incrementPlays.bind(this)}>
                    Add Another
                </button>

                <button type="submit" className="btn btn-primary">
                    Submit</button>

                <Link to={ADMIN_PLAY} className="btn btn-danger">
                    Return To Plays</Link>

                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author First Name</th>
                            <th>Authoor Last Name</th>
                            <th>Genre</th>
                            <th>Time Period</th>
                            <th>Acotor Count</th>
                            <th>Costume Count</th>
                            <th>Copies</th>
                            <th>Spectacle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderPlayInputs()}
                    </tbody>
                </table>
            </form>
            </div>
            </div>
        );
    }

    renderPlayInputs() {
        return _.map(this.state.entryArray, (entry) => {
            return (
                <tr key={entry}>
                    <td><Field type="text" name={`title${entry}`}
                            component={renderField} /> </td>
                    <td><Field type="text" name={`authorFirst${entry}`}
                            component={renderField} /> </td>
                    <td><Field type="text" name={`authorLast${entry}`}
                            component={renderField} /> </td>
                    <td><Field type="text" name={`genre${entry}`}
                            component={renderField} /> </td>
                    <td><Field type="text" name={`timePeriod${entry}`}
                            component={renderField} /> </td>
                    <td><Field type="text" name={`actorCount${entry}`}
                            component={renderField} /> </td>
                    <td><Field type="text" name={`costumeCount${entry}`}
                            component={renderField} /> </td>
                    <td><Field type="text" name={`copies${entry}`}
                            component={renderField} /> </td>
                    <td><Field type="checkbox" name={`hasSpectacle${entry}`}
                            component={renderField} /> </td >
                </tr>
                );
            });
        }

}

function mapStateToProps(state) {
    return {
        token : state.currentUser.token
    }
}

export default reduxForm({
    validate : validatePlay,
    form : "PostMultipleNewPlays"
})(
    connect(mapStateToProps, { addPlays })(PostMultiplePlays)
);
