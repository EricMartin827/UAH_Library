
/* Utility Imports */
const {UTILS} = require("./TOOLS");

/* Error Imports */
const {NODE_ERRORS} = require("./TOOLS");
const {CUSTOM_ERRNO} = NODE_ERRORS;
const {NO_CLIENT_REQUEST} = CUSTOM_ERRNO;
const {ECINVAL} = CUSTOM_ERRNO;
const {FAILED_ID_UPDATE} = CUSTOM_ERRNO;
const {FAILED_QUERY_UPDATE} = CUSTOM_ERRNO;
const {FAILED_ID_REMOVE} =  CUSTOM_ERRNO;
const {FAILED_QUERY_REMOVE} =  CUSTOM_ERRNO;
const {ESINVAL} = CUSTOM_ERRNO;
const {makeErrno} = NODE_ERRORS;

function verifyClient_Input(req, res, next) {
    
}

function verifyClient_BatchInput(req, res, next) {
    
}

