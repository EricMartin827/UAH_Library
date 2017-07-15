"use strict"
const {LIBRARY} = require("./LIB");
const {CUSTOM_LIB} = LIBRARY;
const {nextChar} = CUSTOM_LIB;

const {ERROR_LIB} = require("./LIB");
const {CUSTOM_ERRNO} = ERROR_LIB;
const {makeErrono} = ERROR_LIB;
const {logErrno} = ERROR_LIB;
const {ECINVAL} = CUSTOM_ERRNO;
const {EPERM} = CUSTOM_ERRNO;
const {NO_USER} = CUSTOM_ERRNO;
const {BAD_WEB_TOKEN} = CUSTOM_ERRNO;

const {TestLibrary} = require("./TestLibrary.js");
const {Tester} = TestLibrary;
const {verify} = TestLibrary;
const {expect} = TestLibrary;
const {request} = TestLibrary;

function UserTester(app, schema) {
    Tester.call(this, app, schema)
}
UserTester.prototype = Object.create(Tester.prototype)
UserTester.prototype.constructor = UserTester;
var Interface = UserTester.prototype;

Interface.login = function(data) {

    var _app = this.app;
    var _schema = this.schema;
    return new Promise((resolve, reject) => {
	request(_app)
	    .patch(`/login`)
	    .send(data)
	    .expect(200)
	    .end((err, res) => {
		
		if (err) {
		    return reject(err);
		}

		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		verify(data, res.body, _schema);

		if (res.header["x-user"]) {
		    return resolve(res.header["x-user"]);
		} else if (res.header["x-register"]) {
		    return resolve(res.header["x-register"]);
		}
		reject("Login Failed To Send Back A User Or Register Token");
	    })
    });
}

Interface.badLogin = function(data) {

    var _app = this.app;
    var _status = (data) ? 401 : 400;
    var _code = (data) ? EPERM : ECINVAL;
    return new Promise((resolve, reject) => {
	request(_app)
	    .patch(`/login`)
	    .send(data)
	    .expect(_status)
	    .end((err, res) => {

		if (err) {
		    return reject(err);
		}

		var err = res.body;
		expect(res.clientError).toBe(true);
		expect(res.serverError).toBe(false);
		expect(res.header["x-user"]).toBe(undefined);
		expect(res.header["x-register"]).toBe(undefined);
		expect(err.code).toBe(_code);
		resolve();
	    })
    });
}


Interface.logout = function(data) {
    
    var _app = this.app;
    var _schema = this.schema;
    var _tok = this.authToken;
    return new Promise((resolve, reject) => {
	request(_app)
	    .patch(`/logout`)
	    .set("x-user", `${_tok}`)
	    .expect(200)
	    .then((res) => {

		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		verify(data, res.body, _schema);
		return res.body;
	    })
	    .then((res) => {

		_schema.findOne(res).then((admin) => {
		    for (var ii = 0; ii < admin.tokens.length; ii++) {
			var tok = admin.tokens[ii];
			if (tok && tok.access === "user") {
			    return reject("Failed To Clear User Token")
			}
		    }
		    resolve();
		}).catch((err) => reject(err));
	    })
    });
}

Interface.myPage = function(data) {

    var _app = this.app;
    var _schema = this.schema;
    var _tok = this.authToken;
    return new Promise((resolve, reject) => {
	request(_app)
	    .get(`/me`)
	    .set("x-user", `${_tok}`)
	    .expect(200)
	    .end((err, res) => {

		if (err) {
		    return reject(err);
		}
		
		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		verify(data, res.body, _schema);
		resolve();
	    });
    });
}

module.exports = {
    UserTester : UserTester
}
