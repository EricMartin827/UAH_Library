const {LIBRARY} = require("./AppLibrary.js");
const {NODE_LIB} = LIBRARY;
const {CUSTOM_LIB} = LIBRARY;

const {CONSTANTS} = require("./CONSTANTS.js");

const {ERROR_LIB} = require("./ErrorLibrary.js");
const {ERRNO} = ERROR_LIB;
const {CUSTOM_ERRNO} = ERROR_LIB;
const {makeErrno} = ERROR_LIB;
const {logErrno} = ERROR_LIB;
const {logMongooseError} = ERROR_LIB;

const {Tester} = require("./TestLibrary.js");

module.exports = {

    /* General Library */
    LIBRARY          : LIBRARY,
    NODE_LIB         : NODE_LIB,
    CUSTOM_LIB       : CUSTOM_LIB,
    CONSTANTS        : CONSTANTS,
    
    /* Error Library */
    ERROR_LIB        : ERROR_LIB,
    ERRNO            : ERRNO,
    CUSTOM_ERRNO     : CUSTOM_ERRNO,
    makeErrno        : makeErrno,
    logErrno         : logErrno,
    logMongooseError : logMongooseError,

    /* Testing Library */
    Tester           : Tester
};
