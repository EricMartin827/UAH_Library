"use strict"
const {LIBRARY}       = require("./../library");
const {CUSTOM_LIB}    = LIBRARY;
const {nextChar}      = CUSTOM_LIB;
const {toQuery}       = CUSTOM_LIB;

const {ERROR_LIB}     = require("./../library");
const {CUSTOM_ERRNO}  = ERROR_LIB;
const {logErrno}      = ERROR_LIB;
const {ECINVAL}       = CUSTOM_ERRNO;
const {EPERM}         = CUSTOM_ERRNO;
const {NO_USER}       = CUSTOM_ERRNO;
const {BAD_WEB_TOKEN} = CUSTOM_ERRNO;

const {TestLibrary}   = require("./TestLibrary.js");
const {Tester}        = TestLibrary;
const {verify}        = TestLibrary;
const {verifyBatch}   = TestLibrary;
const {expect}        = TestLibrary;
const {request}       = TestLibrary;
const {hasToken}      = TestLibrary;

function AdminTester(app, schema) {
    Tester.call(this, app, schema)
}

AdminTester.prototype = Object.create(Tester.prototype)
AdminTester.prototype.constructor = AdminTester;
var Interface = AdminTester.prototype;

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
		verify(data, res.body, _schema);

		if (res.header["x-admin"]) {
		    
		    _schema.findOne({email : data.email}).then((target) => {
			
			expect(hasToken(target.tokens, "admin")).toBe(true);
			return resolve(res.header["x-admin"]);
			
		    }).catch((err) => reject(err));
		    
		} else if (res.header["x-register"]) {
		    
		    _schema.findOne({email : data.email}).then((target) => {

			expect(hasToken(target.tokens, "newUser")).toBe(true);
			return resolve(res.header["x-register"]);
			
		    }).catch((err) => reject(err));
		    
		} else {
		    reject("Login Failed To Send Back Token");
		}
	    })
    });
}

Interface.logout = function(data) {
    
    var _app = this.app;
    var _schema = this.schema;
    var _tok = this.authToken;
    return new Promise((resolve, reject) => {
	request(_app)
	    .post(`/admin/logout`)
	    .set("x-admin", `${_tok}`)
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
			if (tok && tok.access === "admin") {
			    return reject("Failed To Clear Admin Token")
			}
		    }
		    resolve();
		}).catch((err) => reject(err));
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
		expect(res.header["x-register"]).toBe(undefined);
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
		verify(data, res.body, _schema);
		resolve();
	    });
    });
}

Interface.myPage_NoToken = function() {

    var _app = this.app;
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
    var _schema = this.schema;
    var _tok = this.authToken;
    return new Promise((resolve, reject) => {

	/* Create the first entry and confirm json data was saved */
	request(_app)
	    .post(`/api/${_mode}/new`) /*Change Made Here*/
	    .set("x-admin", `${_tok}`)
	    .send(data)
	    .expect(200)
	    .expect((res, err) => {

		if (err) {
		    return reject(err);
		}

		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		verify(data, res.body, _schema);
	    })
	    .then((res) => {

		_schema.findOne(res.body)
		    .then((ret) => {

			verify(res, ret, _schema);
			if (_mode === "users") {
			    expect(ret.tokens.length).toBe(1);
			    expect(ret.tokens[0]).toNotBe(null);
			    expect(ret.tokens[0]).toNotBe(undefined);
			    expect(ret.tokens[0].access).toBe("newUser");
			}
			resolve(ret);

		    }).catch((err) => reject(err));
		
	    }).catch((err) => {
		reject(err)
	    });
    });
    
}

Interface.postMany = function(data) {

    var _app = this.app;
    var _mode = this.mode;
    var _schema = this.schema;
    var _tok = this.authToken;
    return new Promise((resolve, reject) => {

	request(_app)
	    .post(`/api/${_mode}/new`)
	    .set("x-admin", `${_tok}`)
	    .send(data)
	    .expect(200)
	    .expect((res, err) => {

		if (err) {
		    return reject(err);
		}

		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		expect(res.body.length).toBe(data.length);
		verifyBatch(data, res.body, _schema)
		resolve(res.body);

	    }).catch((err) => reject(err));
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
	    .set("x-admin", `${_tok}`)
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

Interface.deleteById = function(id) {

    var _app = this.app;
    var _mode = this.mode;
    var _schema = this.schema;
    var _tok = this.authToken;
    return new Promise((resolve, reject) => {
	request(_app)
	    .post(`/api/${_mode}/delete/${id}`)
	    .set("x-admin", `${_tok}`)
	    .expect(200)
	    .end((err, res) => {

		if (err) {
		    return reject(err);
		}

		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		
		_schema.findOne(res.body).then((data) => {
		    expect(data).toBe(null);
		}).catch((err) => reject(err));
		resolve(res.body);
	    })
    });
}


module.exports = {
    AdminTester : AdminTester
}
