/* Error Imports */
const {NODE_ERRORS} = require("./../TOOLS");
const {CUSTOM_ERRNO} = NODE_ERRORS;
const {NO_CLIENT_REQUEST} = CUSTOM_ERRNO;
const {ECINVAL} = CUSTOM_ERRNO;
const {FAILED_QUERY} = CUSTOM_ERRNO;
const {FAILED_UPDATE} =  CUSTOM_ERRNO;
const {ESINVAL} = CUSTOM_ERRNO;
const {makeErrno} = NODE_ERRORS;


/* Import the Mongo.js Wrapper */
const {Mongo} = require("./../Mongo.js");

/* 
 * Import the Active Mongoose Models. The $ prefix prevents name collision
 * within the the Control.js module.
 */
const $Play = require("./../MongoModels").Play;
const $User = require("./../MongoModels").User;


/* 
* Wrap the Models. All Models now share a common interface which can be
* accessed dynamically from server by using Control("Play"), Control("User"),
* etc..
*/
const Play = new Mongo($Play);
const User = new Mongo($User);


/*
 * All objects in JavaScript are collections of name/value pairs. By having
 * four names map to the same mode {or more specifically the same Mongoose 
 * Database Model}, the code enables the API to handle both lowercase and
 * uppercase {play or Play}. It gives the client a litle more flexibility in
 * communicating wiht the server.
 */
const Modes = {

    play  : Play,
    plays : Play,
    Play  : Play,
    Plays : Play,

    user  : User,
    users : User,
    User  : User,
    Users : User
}


function initMode(req, res, next) {
    if (!Modes.hasOwnProperty(clientArg)) {
	return res.status(400).send(
	    makeErrno(`${clientArg} is not a valid database collection`));
    }
    res.header("x-mode", Modes[clientArg]);
}

module.exports = {
    initMode : initMode
}
