/* NPM Testing Imports*/
const expect          = require("expect");
const request         = require("supertest");

/* Library Impoorts */
const {LIBRARY}       = require("./../library");
const {CUSTOM_LIB}    = LIBRARY;
const {NODE_LIB}      = LIBRARY;
const {isArray}       = CUSTOM_LIB;
const {isSchema}      = CUSTOM_LIB;
const {stringify}     = CUSTOM_LIB;
const {nextChar}      = CUSTOM_LIB;
const {toQuery}       = CUSTOM_LIB;
const {_}             = NODE_LIB;

/* Error Imports */
const {ERROR_LIB}     = require("./../library");
const {CUSTOM_ERRNO}  = ERROR_LIB;
const {ESINVAL}       = CUSTOM_ERRNO;
const {ECINVAL}       = CUSTOM_ERRNO;
const {BAD_WEB_TOKEN} = CUSTOM_ERRNO;
const {makeErrno}     = ERROR_LIB;

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

    if (!isSchema(newSchema)) {
	throw makeErrno(ESINVAL, `Invalid Schema:\n${stringify(schema)}`);
    }

    this.schema = newSchema;
    this.mode = newSchema.collection.collectionName;
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
	    .post("/register")
	    .set("x-register", `${_tok}`)
	    .send(data)
	    .expect(200)
	    .expect((res, err) => {

		if (err) {
		    return reject(err);
		}

		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		expect(res.body).toNotBe(null);
		expect(res.body.token).toNotBe(null);

	    }).then((res) => {

		var email = data.email;
		var tok = res.body.token;

		_schema.findOne({email}).then((user) => {

		    expect(user).toNotBe(null);
		    expect(user.tokens.length).toBe(1);
		    expect(user.tokens[0]).toNotBe(null);
		    expect(user.tokens[0].access).toBe(user.access);
		    verify(data, user, _schema);
		    resolve(tok);

		}).catch((err) => reject(err));

	    }).catch((err) => reject(err));
    });
}

Interface.register_NoToken = function(data) {

    var _app = this.app;
    return new Promise((resolve, reject) => {
	request(_app)
	    .post("/register")
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

    var _app = this.app;
    return new Promise((resolve, reject) => {
	request(_app)
	    .post(`/register`)
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
	    .post(`/register`)
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
    for (var prop in attributes) {
	expect(clientReq[prop]).toEqual(serverRes[prop]);
    }
}

function verifyBatch(clientReq, serverRes, schema) {

    expect(isArray(clientReq)).toBe(true);
    expect(isArray(serverRes)).toBe(true);
    for (var ii = 0; ii < clientReq.length; ii++) {
	verify(clientReq[ii], serverRes[ii], schema);
    }
}

function hasToken(tokens, access) {

    for (var ii = 0; ii < tokens.length; ii++) {
	if (tokens[ii].access === access) {
	    return true;
	}
    }
    return false;
}

module.exports = {
    TestLibrary : {
	expect      : expect,
	request     : request,
	Tester      : Tester,
	verify      : verify,
	verifyBatch : verifyBatch,
	hasToken    : hasToken
    }
}
