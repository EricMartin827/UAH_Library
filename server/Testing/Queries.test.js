"use strict"

const {TestLibrary} = require("./TestLibrary.js");
const {ERRNO}       = TestLibrary;
const {expect}      = TestLibrary;
const {verifyBatch} = TestLibrary;

const {AdminTester} = require("./AdminTester.js");
const {UserTester}  = require("./UserTester.js");
const {DATA}        = require("./LocalData.js");

const {main}        = require("./../Main.js");
const {Schemas}     = require("./../Schemas");
const {Play}        = Schemas;
const {User}        = Schemas;

var loginCredentials;
const _Admin = new AdminTester(main, User);
const _User = new UserTester(main, User);

describe("User Query Tests", () => {

    var admins = DATA.fiveAdmins;
    var users = DATA.fiveUsers;
    var regAdmin, regUser;

    before((done) => {
	_Admin.seed(DATA.admin).then((credentials) => {
	    _Admin.login(credentials).then((tok) => {
		_Admin.setToken(tok);
		_Admin.postMany(admins).then(() => {
		    _Admin.postMany(users).then(() => {
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

    it("Should Allow Admin to Fetch All Users", (done) => {
	regAdmin = new AdminTester(main, User);

	regAdmin.login(
	    {email : admins[0].email, password : admins[0].password})
	    .then((tok) => {
		regAdmin.setToken(tok);

		regAdmin.register(
		    {email : admins[0].email, password : "Mr. M33SIX"})
		    .then((tok) => {
			regAdmin.setToken(tok);

			regAdmin.get({access : "user"}).then((res) => {
			    verifyBatch(res, users, User);
			    done();

			}).catch((err) => done(err));
		    }).catch((err) => done(err));
	    }).catch((err) => done(err));
    });

    it("Should Allow Student to Fetch All Users", (done) => {
	done("Not Tested");
    });
});
