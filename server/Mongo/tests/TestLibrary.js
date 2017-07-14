/* NPM Testing Imports*/
const expect = require("expect");
const request = require("supertest");

/* Library Impoorts */
const {LIBRARY} = require("./LIB");
const {CUSTOM_LIB} = LIBRARY;
const {NODE_LIB} = LIBRARY;
const {isArray} = CUSTOM_LIB;
const {isSchema} = CUSTOM_LIB;
const {stringify} = CUSTOM_LIB;
const {_} = NODE_LIB;

/* Error Imports */
const {ERROR_LIB} = require("./LIB");
const {CUSTOM_ERRNO} = ERROR_LIB;
const {ESINVAL} = CUSTOM_ERRNO;


function Constructor(app, schema) {

    if (!isSchema(schema)) {
	throw makeErrno(ESINVAL, `Invalid Schema:\n${stringify(schema)}`);
    }

    this.app = app;
    this.schema = schema;
    this.mode = schema.collection.collectionName;
    
}

function verify(clientReq, serverRes, schema) {

    var attributes = _.pick(clientReq, schema.getAttributes());
    for (var ii = 0; ii < attributes.length; ii++) {
	var prop = attributes[ii];
	expect(clientReq[prop]).toEqual(serverRes[prop]);
    }
}

function verifyBatch(clientReq, serverRes, schema) {

    if (!(isArray(clientReq) && isArray(serverRes))) {
	return Promise.reject(makeErrno(
	    ESINVAL,
	    `Non-Array Values Sent to Batch Comparision: ` +
		`client: ${clientReq} / serverRes: ${severRes}`));
    }

    if (!(clientReq.length !== serverRes)) {
	return Promise.reject(makeErrno(
	    ESINVAL,
	    `Server Failed To Complete Process All Cleint Elements: ` +
		`clientLength=${clientRes.length} \ ` +
		`sserverLength=${serverRes.length}`));
    }
    
    for (var ii = 0; ii < clientReq.length; ii++) {
	verify(clientRes[ii], serverRes[ii], schema);
    }

}

module.exports = {
    TestLibrary : {
	expect      : expect,
	request     : request,
	Constructor : Constructor,
	verify      : verify,
	verifyBatch : verifyBatch
    }
}













