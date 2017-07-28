"use strict"

const {TestLibrary} = require("./TestLibrary.js");
const {ERRNO}       = TestLibrary;
const {expect}      = TestLibrary;

const {AdminTester} = require("./AdminTester.js");
const {UserTester}  = require("./UserTester.js");
const {DATA}        = require("./LocalData.js");

const {main}     = require("./../Main.js");
const {Schemas}     = require("./../Schemas");
const {Play}        = Schemas;
const {User}        = Schemas;

var loginCredentials;
const _Admin = new AdminTester(main, User);
const _User = new UserTester(main, User);

describe("User Query Tests", () => {

    var admins;
    var users;
    before((done) => {
	_Admin.seed(DATA.admin).then((credentials) => {
	    _Admin.login(credentials).then((tok) => {
		_Admin.setToken(tok);
		_Admin.postMany(DATA.fiveAdmins).then((res) => {
		    admins = res;
		    _Admin.postMany(DATA.fiveUsers).then((res) => {
			users = res;
			done();
		    }).catch((err) => done(err));
		}).catch((err) => done(err));
	    }).catch((err) => done(err));
	}).catch((err) => done(err));
    });

    after((done) => {
	User.remove({}).then(() => {
	    Play.remove({})
		.then(() => done())
		.catch((err) => done(err));
	}).catch((err) => done(err));
    })

    it("Should Fetch All Users", (done) => {
	done("Not Implemented Yet");
    });

});
