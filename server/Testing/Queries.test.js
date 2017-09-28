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

    /* Alias the test data and declare a registerd admin and user */
    var admins = DATA.fiveAdmins;
    var users = DATA.fiveUsers;
    var regAdmin, regUser;

    /*
     * Seed the database with the initial admin and load all other admins
     * admins and users for test cases.
     */
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

    /* Clean up the database */
    after((done) => {
	User.remove({}).then(() => {
	    Play.remove({})
		.then(() => done())
		.catch((err) => done(err));
	}).catch((err) => done(err));
    });

    /*
     * Initialize the registered admin and keep them logged in.
     * Test whether the admin can quary for all users.
     */
    it("Should Allow Admin to Fetch All Users", (done) => {
	regAdmin = new AdminTester(main, User);

	regAdmin.login(
	    {email : admins[0].email, password : admins[0].password})
	    .then((tok) => {

		/* Set the admin's registration token */
		regAdmin.setToken(tok);
		regAdmin.register(
		    {email : admins[0].email, password : "Mr. M33SIX"})
		    .then((tok) => {

			/* Set the admin's active session token */
			regAdmin.setToken(tok);
			regAdmin.get({access : "user"}).then((res) => {
			    verifyBatch(users, res, User);
			    done();

			}).catch((err) => done(err));
		    }).catch((err) => done(err));
	    }).catch((err) => done(err));
    });

    it("Should Allow Student to Fetch All Users", (done) => {
    	regUser = new UserTester(main, User);

    	regUser.login(
    	    {email : users[0].email, password : users[0].password})
    	    .then((tok) => {

		/* Set the user's registration token */
		regUser.setToken(tok);
		regUser.register(
		    {email : users[0].email, password : "P1ckl3 R1ck"})
		    .then((tok) => {
			
			/* Set the user's active session token */
			regUser.setToken(tok);
			regUser.get({access : "user"}).then((res) => {
			    verifyBatch(users, res, User);
			    done();
			    
			}).catch((err) => done(err));
		    }).catch((err) => done(err));
	    }).catch((err) => done(err));
    });

    it("Should Allow Admin To Find User by First Name", (done) => {

	regAdmin.get({ firstName : "Peter" }).then((res) => {
	    expect(res.length).toBe(1);
	    expect(res[0].lastName).toEqual("Rabbit");
	    done();
	}).catch((err) => done(err));
    });

    it("Should Allow A User To Find A User by First Name", (done) => {

	regAdmin.get({ firstName : "Peter" }).then((res) => {
	    expect(res.length).toBe(1);
	    expect(res[0].lastName).toEqual("Rabbit");
	    done();
	}).catch((err) => done(err));
    });

});
