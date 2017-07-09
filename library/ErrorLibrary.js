/**
 * ErrorLibrayr.js is an error handling library/module. It provides a means
 * for concisely generating and logging errors in the main server.
 * Errors generated via this module record the types of errors,
 * a message providing a context for understanding the event that
 * triggered the error, and a logger which saves errors to standard  error.
 *
 * @module ErrorLibrary.js
 * @author Eric William Martin
 */

const {ERRNO} = require("./ErrorCodes.js");
const {CUSTOM_ERRNO} = require("./ErrorCodes.js");

function makeErrno(code, msg) {

    /* Throw a deterministic error message that can be
     * reliably parsed to isolate the stack line
     * containing the faulting file and line number.
     */
    var err;
    try {
	 throw new Error("");
    } catch (e) {
	err = e;
    }

    /* Split the Stack Trace into a 4 element array
     * and remove the elements at indexes = 0, 1, and 3.
     */
    var aux = err.stack.split("\n");
    aux.splice(0, 2);
    aux.splice(1, 1);

    /* Set the error code and the desired message */
    err.code = code;
    err.message = `${msg} : ${aux[0].trim()}`;

    return err;
}

function logMongooseError(err) {
    console.error(`ERROR --> ${err.name} : ${err._message}`);
}

function logErrno(err) {
    console.error(`ERROR --> ${ERRNO[err.code]} : ${err.message}`);
}

module.exports = {
    ERROR_LIB :
    {
	ERRNO : ERRNO,
	CUSTOM_ERRNO : CUSTOM_ERRNO,
	makeErrno : makeErrno,
	logErrno : logErrno,
	logMongooseError : logMongooseError
    }
}
