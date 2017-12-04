"use strict"
const {LIBRARY} = require("./../library");
const {CUSTOM_LIB} = LIBRARY;
const {nextChar} = CUSTOM_LIB;
const {toQuery} = CUSTOM_LIB;

const {ERROR_LIB} = require("./../library");
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
    var _mode = this.mode;
    var _schema = this.schema;
    return new Promise((resolve, reject) => {
	request(_app)
	    .post(`/${_mode}/login`)
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
    var _mode = this.mode;
    var _status = (data) ? 401 : 400;
    var _code = (data) ? EPERM : ECINVAL;
    return new Promise((resolve, reject) => {
	request(_app)
	    .post(`/${_mode}/login`)
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
    var _mode = this.mode;
    var _schema = this.schema;
    var _tok = this.authToken;

    return new Promise((resolve, reject) => {
	request(_app)
	    .post(`/${_mode}/logout`)
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
	    }).catch((err) => reject(err));
    });
}

Interface.myPage = function(data) {

    var _app = this.app;
    var _mode = this.mode;
    var _schema = this.schema;
    var _tok = this.authToken;
    return new Promise((resolve, reject) => {
	request(_app)
	    .get(`/${_mode}/me`)
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

Interface.myPage_NoToken = function() {

    var _app = this.app;
    var _mode = this.mode;
    return new Promise((resolve, reject) => {
	request(_app)
	    .get(`/${_mode}/me`)
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

Interface.myPage_BadToken = function(badToken) {

    var _app = this.app;
    var _mode = this.mode;
    return new Promise((resolve, reject) => {
	request(_app)
	    .get(`/${_mode}/me`)
	    .set("x-user", `${badToken}`)
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


Interface.myPage_AlteredToken = function() {

    var _app = this.app;
    var _mode = this.mode;
    var _tok = this.authToken;
    var c = _tok.charAt(0);
    _tok = _tok.replace(c, nextChar(c));
    return new Promise((resolve, reject) => {
	request(_app)
	    .get(`/${_mode}/me`)
	    .set("x-user", `${_tok}`)
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

Interface.badAdminAccess = function(data) {

    var _app = this.app;
    var _mode = this.mode;
    var _tok = this.authToken;
    return new Promise((resolve, reject) => {
	request(_app)
	    .get("/admin/me")
	    .set("x-user", `${_tok}`)
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

Interface.attackAdminAccess = function(data) {

    var _app = this.app;
    var _mode = this.mode;
    var _tok = this.authToken;
    return new Promise((resolve, reject) => {
	request(_app)
	    .get("/admin/me")
	    .set("x-admin", `${_tok}`)
	    .expect(401)
	    .end((err, res) => {

		if (err) {
		    return reject(err);
		}

		var err = res.body;
		expect(res.clientError).toBe(true);
		expect(res.serverError).toBe(false);
		expect(err.code).toBe(NO_USER);
		resolve();
	    });
    });
}

Interface.get = function(query) {

    var _app = this.app;
    var _mode = this.mode;
    var _tok = this.authToken;
    var _query = (query) ? toQuery(query) : "";
    return new Promise((resolve, reject) => {
	request(_app)
	    .get(`/api/${_mode}?${_query}`)
	    .set("x-user", `${_tok}`)
	    .expect(200)
	    .end((err, res) => {

		if (err) {
		    return reject(err);
		}
		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		resolve(res.body);
	    })
    });
}

Interface.checkOutValid = function(data) {

    var _app = this.app;
    var _tok = this.authToken;
    return new Promise((resolve, reject) => {

	request(_app)
	    .post(`/api/play/checkout/${data}`)
	    .send(data)
	    .set("x-user", `${_tok}`)
	    .expect(200)
	    .end((err, res) => {

		if (err) {
		    return reject(err);
		}

		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		
		resolve(res.body);
	    })
    });
}

Interface.checkOutInvalid = function(data) {

    var _app = this.app;
    var _tok = this.authToken;
    return new Promise((resolve, reject) => {

	request(_app)
	    .post(`/api/play/checkout/${data}`)
	    .send(data)
	    .set("x-user", `${_tok}`)
	    .expect(400)
	    .end((err, res) => {

		if (err) {
		    return reject(err);
		}

		expect(res.clientError).toBe(true);
		expect(res.serverError).toBe(false);
		resolve();
	    })
    });
}


Interface.returnCheckOut = function(checkOutID, userID) {

    var _app = this.app;
    var _tok = this.authToken;
    
    return new Promise((resolve, reject) => {

	request(_app)
	    .post(`/api/play/checkout/delete/${checkOutID}`)
	    .send({})
	    .set("x-user", `${_tok}`)
	    .expect(200)
	    .end((err, res) => {

		if (err) {
		    reject(err);
		}

		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		resolve();
	    });
    });
}

Interface.getCheckOuts = function() {
    var _app = this.app;
    var _tok = this.authToken;
    
    return new Promise((resolve, reject) => {

	request(_app)
	    .get(`/api/user/checkout`)
	    .set("x-user", `${_tok}`)
	    .expect(200)
	    .end((err, res) => {

		if (err) {
		    reject(err);
		}

		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		resolve(res.body);
	    });
    });
}

module.exports = {
    UserTester : UserTester
}
