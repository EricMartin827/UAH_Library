"use strict"

const {TestLibrary} = require("./TestLibrary.js");
const {ERRNO} = TestLibrary;
const {expect} = TestLibrary;

const {AdminTester} = require("./AdminTester.js");
const {UserTester} = require("./UserTester.js");
const {DATA} = require("./LocalData.js");

const {mainApp} = require("./LocalMongoServer.js");
const {Schemas} = require("./../Schemas");
const {Play} = Schemas;
const {User} = Schemas;

const _Admin = new AdminTester(mainApp, User);
const _User = new UserTester(mainApp, User);


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
