import React, { Component } from "react";

export default class Register extends Component {

    render() {

        console.log("Register Component", this.props.currentUser);
        return (
            <div> This Is The Register Page </div>
        );
    }
}

function mapStateToProps(state) {
    return { currentUser : state.currentUser }
}
