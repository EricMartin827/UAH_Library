"use strict"

const {AdminTester} = require("./AdminTester.js");
const {mainApp} = require("./LocalMongoServer.js");
const {DATA} = require("./LocalData.js");
const {Schemas} = require("./../Schemas");
const {Play} = Schemas;
const {User} = Schemas;

var loginCredentials;
const Admin = new AdminTester(mainApp, User);

describe("Simple Admin Security Tests", () => {

    before((done) => {
	Admin.seed(DATA.admin).then((res) => {
	    loginCredentials = res;
	    done();
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


    it("Should Allow the Admin to Login", (done) => {
	Admin.login(loginCredentials)
	    .then((tok) => {
		Admin.setToken(tok);
		done()
	    })
	    .catch((err) => done(err));
    });

    it("Should Not Allow Admin To Login With Wrong Password", (done) => {
	var email = loginCredentials.email;
	var password = "Testing Is g00d :)";
	Admin.badLogin({email, password})
	    .then(() => done()).catch(() => done(err));
    });

    it("Should Require Admin to Provide A Email and Password", (done) => {
	Admin.badLogin().then(() => done()).catch((err) => done(err));
    });

    it("Should Allow The Admin To Access Personal Profile", (done) => {
	Admin.myPage().then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow Admin Access With No Token", (done) => {
	Admin.myPage_NoToken().then(() => done()).catch((err) => done(err));
    })

    it("Should Not Allow Admin Access With Invalid Token", (done) => {
	Admin.myPage_BadToken("This token should not work")
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow Admin Access With AlteredToken", (done) => {
	Admin.myPage_AlteredToken()
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Allow The Admin to Logout and Clear Their Token", (done) => {
	Admin.logout(DATA.admin).
	    then(() => done()).catch((err) => done(err));
    });

});
