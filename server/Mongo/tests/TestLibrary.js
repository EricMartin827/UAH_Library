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
const {nextChar} = CUSTOM_LIB;
const {_} = NODE_LIB;

/* Error Imports */
const {ERROR_LIB} = require("./LIB");
const {CUSTOM_ERRNO} = ERROR_LIB;
const {ESINVAL} = CUSTOM_ERRNO;
const {ECINVAL} = CUSTOM_ERRNO;
const {BAD_WEB_TOKEN} = CUSTOM_ERRNO;

function Tester(app, schema) {

    if (!isSchema(schema)) {
	throw makeErrno(ESINVAL, `Invalid Schema:\n${stringify(schema)}`);
    }

    this.app = app;
    this.schema = schema;
    this.mode = schema.collection.collectionName;
}

var Interface = Tester.prototype;
Interface.setSchema = function(newSchema) {

    if (!isSchema(schema)) {
	throw makeErrno(ESINVAL, `Invalid Schema:\n${stringify(schema)}`);
    }

    this.schema = newSchema;
    this.mode = schema.collection.collectionName;
}

Interface.setToken = function(tok) {
    this.authToken = tok;
}

Interface.register = function(data) {

    var _app = this.app;
    var _schema = this.schema;
    var _tok = this.authToken;
    return new Promise((resolve, reject) => {
	request(_app)
	    .patch("/register")
	    .set("x-register", `${_tok}`)
	    .send(data)
	    .expect(200)
	    .expect((res, err) => {

		if (err) {
		    return reject(err);
		}

		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		verify(data, res.body, _schema);

	    }).then(() => {

		var email = data.email;
		var password = data.password;
		_schema.findOne({email}).then((user) => {

		    expect(user).toNotBe(null);
		    expect(user.tokens.length).toBe(1);
		    expect(user.tokens[0]).toBe(null);
		    resolve();

		}).catch((err) => reject(err));

	    }).catch((err) => reject(err));
    });
}

Interface.register_NoToken = function(data) {

    var _app = this.app;
    return new Promise((resolve, reject) => {
	request(_app)
	    .patch("/register")
	    .send(data)
	    .expect(401)
	    .end((err, res) => {

		if (err) {
		    return reject(err);
		}

		var err = res.body;
		expect(res.clientError).toBe(true);
		expect(res.serverError).toBe(false);
		expect(err.code).toBe(ECINVAL);
		resolve();
	    });
    });
}

Interface.register_BadToken = function(data, badToken) {

    console.log()
    var _app = this.app;
    return new Promise((resolve, reject) => {
	request(_app)
	    .patch(`/register`)
	    .set("x-register", `${badToken}`)
	    .send(data)
	    .expect(401)
	    .end((err, res) => {

		if (err) {
		    return reject(err);
		}

		var err = res.body;
		expect(res.clientError).toBe(true);
		expect(res.serverError).toBe(false);
		expect(err.code).toBe(BAD_WEB_TOKEN);
		resolve();
	    });
    });
}

Interface.register_AlteredToken = function(data) {

    var _app = this.app;
    var _tok = this.authToken;
    var c = _tok.charAt(0);
    _tok = _tok.replace(c, nextChar(c));
    return new Promise((resolve, reject) => {
	request(_app)
	    .patch(`/register`)
	    .set("x-register", `${_tok}`)
	    .send(data)
	    .expect(401)
	    .end((err, res) => {

		if (err) {
		    return reject(err);
		}

		var err = res.body;
		expect(res.clientError).toBe(true);
		expect(res.serverError).toBe(false);
		expect(err.code).toBe(BAD_WEB_TOKEN);
		resolve();
	    });
    });
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
	Tester      : Tester,
	verify      : verify,
	verifyBatch : verifyBatch
    }
}
