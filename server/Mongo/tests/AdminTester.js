"use strict"
const {LIBRARY} = require("./LIB");
const {CUSTOM_LIB} = LIBRARY;
const {nextChar} = CUSTOM_LIB;

const {ERROR_LIB} = require("./LIB");
const {CUSTOM_ERRNO} = ERROR_LIB;
const {logErrno} = ERROR_LIB;
const {ECINVAL} = CUSTOM_ERRNO;
const {EPERM} = CUSTOM_ERRNO;
const {NO_USER} = CUSTOM_ERRNO;
const {BAD_WEB_TOKEN} = CUSTOM_ERRNO;

const {TestLibrary} = require("./TestLibrary.js");
const {Constructor} = TestLibrary;
const {verify} = TestLibrary;
const {expect} = TestLibrary;
const {request} = TestLibrary;

function AdminTester(app, schema) {
    Constructor.call(this, app, schema)
}

var Interface = AdminTester.prototype;

Interface.setToken = function(tok) {
    this.authToken = tok;
}

/* Populate the database with a 'root' admin to get things started. */
Interface.seed = function(data) {

    var _app = this.app;
    var _schema = this.schema;
    return new Promise((resolve, reject) => {
	request(_app)
	    .post(`/admin`)
	    .send(data)
	    .expect(200)
	    .end((err, res) => {

		if (err) {
		    return reject(err);
		}

		var seed = res.body;
		var email = data.email;
		var password = data.password;
		
		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		verify(data, seed, _schema);
		resolve({email, password});
	    });
    });
}

/* Test logging in to the database. Method sets an authentication token. */
Interface.login = function(data) {

    var _app = this.app;
    var _schema = this.schema;
    return new Promise((resolve, reject) => {
	request(_app)
	    .post(`/admin/login`)
	    .send(data)
	    .expect(200)
	    .end((err, res) => {
		
		if (err) {
		    return reject(err);
		}

		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		expect(res.header["x-admin"]).toNotBe(null);

		if (data) {
		    verify(data, res.body, _schema);
		}

		resolve(res.header["x-admin"]);
	    })
    });
}

Interface.badLogin = function(data) {

    var _app = this.app;
    var _schema = this.schema;
    var _status = (data) ? 401 : 400;
    var _code = (data) ? EPERM : ECINVAL;
    return new Promise((resolve, reject) => {
	request(_app)
	    .post(`/admin/login`)
	    .send(data)
	    .expect(_status)
	    .end((err, res) => {

		if (err) {
		    return reject(err);
		}

		var err = res.body;
		expect(res.clientError).toBe(true);
		expect(res.serverError).toBe(false);
		expect(res.header["x-admin"]).toBe(undefined);
		expect(err.code).toBe(_code);
		resolve();
	    })
    });
}

Interface.myPage = function(data) {

    var _app = this.app;
    var _schema = this.schema;
    var _tok = this.authToken;
    return new Promise((resolve, reject) => {
	request(_app)
	    .get(`/admin/me`)
	    .set("x-admin", `${_tok}`)
	    .expect(200)
	    .end((err, res) => {

		if (err) {
		    return reject(err);
		}
		
		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		if (data) {
		    verify(data, res.body, _schema);
		}
		resolve();
	    });
    });
}

Interface.myPage_NoToken = function() {

    var _app = this.app;
    var _schema = this.schema;
    return new Promise((resolve, reject) => {
	request(_app)
	    .get(`/admin/me`)
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
    var _schema = this.schema;
    return new Promise((resolve, reject) => {
	request(_app)
	    .get(`/admin/me`)
	    .set("x-admin", `${badToken}`)
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
    var _tok = this.authToken;
    var c = _tok.charAt(0);
    _tok = _tok.replace(c, nextChar(c));
    return new Promise((resolve, reject) => {
	request(_app)
	    .get(`/admin/me`)
	    .set("x-admin", `${_tok}`)
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


Interface.postOne = function(data) {

    var _app = this.app;
    var _mode = this.mode;
    return new Promise((resolve, reject) => {

	/* Create the first entry and confirm json data was saved */
	request(_app)
	    .post(`/admin/${_mode}`)
	    .send(data)
	    .expect(200)
	    .expect((res, err) => {

		if (err) {
		    return reject(err);
		}

		var doc = res.body;
		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		verify(data, doc);
	    })
	    .then((res) => {

		/* Retrieve data to confirm that server document
		 * matches the client's json data.
		 */
		request(_app)
		    .get(`admin/${_mode}/${res.body._id}`)
		    .expect(200)
		    .then((res) => {

			expect(res.clientError).toBe(false);
			expect(res.serverError).toBe(false);
			verify(data, res.body);
			resolve(res.body);
		    })
	    });
    });
    
}

Interface.postDuplicate = function(data) {
    
}

Interface.postMany = function(data) {
    
}

module.exports = {
    AdminTester : AdminTester
}
