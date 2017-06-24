
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
 * Import the Active Mongoose Models. The $ prefix prevents name collsion
 * within the the Control.js module.
 */
const $Play = require("./Play.js").Play;
const $User = require("./User.js").User;


/* 
* Wrap the Models. All Models now share a common interface which can be
* accessed dynamically from server by using Models("Play"), Models("User"),
* etc..
*/
const Play = new Mongo($Play);
const User = new Mongo($User);

const Modes = {
    Play : Play,
    User : User
}

function Control(clientArg) {
    
    if (!Modes.hasOwnProperty(clientArg)) {
	throw makeErrno("ECINVAL",
			`${clientArg} is not a valid database collection`);
    }
    return Modes[clientArg];
}

/* Export the Interface */
module.exports = {Control};
