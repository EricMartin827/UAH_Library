/**
 * ERRNO.js is an error handling utility. It provides a means
 * for concisely generating and logging errors in the main server
 * code. Errors generated via this module record the types of error,
 * a message providing a context for understanding the event that
 * triggered the error, and a logger which saves errors to standad
 * error.
 *
 * @module ERRNO.js
 * @author Eric William Martin
 */

const {ERRNO} = require("./ErrorCodes.js");
const {CUSTOM_ERRNO} = require("./ErrorCodes.js");

function makeErrno(code, msg) {

    /* Throw a deterministic error message that can be
     * reliably processed to isolate the stack line
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
    NODE_ERRORS :
    {
	ERRNO : ERRNO,
	CUSTOM_ERRNO : CUSTOM_ERRNO,
	makeErrno : makeErrno,
	logErrno : logErrno,
	logMongooseError : logMongooseError
    }
}
