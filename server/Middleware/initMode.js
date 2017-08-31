/* Error Imports */
const {ERROR_LIB} = require("./LIB");
const {makeErrno} = ERROR_LIB;


/* Import the Mongo.js Wrappery */
const {Mongo} = require("./../Schemas");

/* 
 * Import the Active Mongoose Models. The $ prefix prevents name collision
 * within the the Control.js module.
 */
const {Schemas} = require("./../Schemas");
const $Play = Schemas.Play;
const $User = Schemas.User;


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

    var clientParam = req.params.mode;
    if (!Modes.hasOwnProperty(clientParam)) {
	return res.status(400).send(
	    makeErrno(`${clientParam} is not a valid database collection`));
    }
    req.header["x-mode"] = Modes[clientParam];
    next();
}

module.exports = {
    initMode : initMode
}
