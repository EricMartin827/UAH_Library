"use strict"

const {main}        = require("./../Main.js");

const {TestLibrary} = require("./TestLibrary.js");
const {ERRNO}       = TestLibrary;
const {expect}      = TestLibrary;

const {AdminTester} = require("./AdminTester.js");
const {UserTester}  = require("./UserTester.js");
const {DATA}        = require("./LocalData.js");

const {Schemas}     = require("./../Schemas");
const {Play}        = Schemas;
const {User}        = Schemas;

const _Admin = new AdminTester(main, User);
const _User = new UserTester(main, User);

describe("User Addtion Tests", () => {

    before((done) => {
	_Admin.seed(DATA.admin).then((credentials) => {
	    _Admin.login(credentials).then((tok) => {
		_Admin.setToken(tok);
		done();
	    })
	}).catch((err) => {
	    done(err)
	});
    });

    beforeEach((done) => {
	User.remove({
	    email : { $ne : DATA.admin.email}
	}).then(() => done());
    });

    afterEach((done) => {
	User.remove({
	    email : { $ne : DATA.admin.email}
	}).then(() => done());
    });

    after((done) => {
	User.remove({}).then(() => done());
    });

    it("Should Add A Student User", (done) => {
	_Admin.postOne(DATA.user)
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Add An Admin User", (done) => {
	_Admin.postOne(DATA.newAdmin)
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Add Multiple Student Users", (done) => {
	_Admin.postMany(DATA.fiveUsers)
	    .then(() => done()).catch((err) => done(err));
    });

});

describe("Play Addition Tests", () => {

    /* Add the Admin Seed and Switch From User to Play Mode */
    before((done) => {
	_Admin.seed(DATA.admin).then((credentials) => {
	    _Admin.login(credentials).then((tok) => {
		_Admin.setToken(tok);
		_Admin.setSchema(Play);
		done();
	    })
	}).catch((err) => {
	    done(err)
	});
    });

    beforeEach((done) => {
	Play.remove({}).then(() => done()).catch((err) => done(err));
    });
    
    afterEach((done) => {
	Play.remove({}).then(() => done()).catch((err) => done(err));
    });

    /* Remove the Seed Admin */
    after((done) => {
	User.remove({}).then(() => done()).catch((err) => done(err));
    });

    it("Should Allow Admin To Post A Single Play", (done) => {
	_Admin.postOne(DATA.onePlay)
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Allow Admin To Post Multple Plays", (done) => {
	_Admin.postMany(DATA.fivePlays)
	    .then(() => done()).catch((err) => done(err));
    });

});

