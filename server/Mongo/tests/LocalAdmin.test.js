"use strict"

const {TestLibrary} = require("./TestLibrary.js");
const {ERRNO} = TestLibrary;
const {expect} = TestLibrary;

const {AdminTester} = require("./AdminTester.js");
const {DATA} = require("./LocalData.js");

const {mainApp} = require("./LocalMongoServer.js");
const {Schemas} = require("./../Schemas");
const {Play} = Schemas;
const {User} = Schemas;

var loginCredentials;
const Admin = new AdminTester(mainApp, User);

before((done) => {
    Admin.seed(DATA.admin).then((res) => {
	loginCredentials = res;
	done();
    }).catch((err) => {
	done(err)
    });
});

after((done) => {
    User.remove({}).then(() => done());
});

describe("Simple Admin Security Tests", () => {

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

    it("Should Not Allow Admin To Their Personal Page After Logout", (done) => {
	Admin.myPage().then(() => {
	    done("Application Allowed Acces After Logout");
	}).catch((err) => {
	    expect(err.message)
		.toBe(`expected 200 "OK", got 401 "Unauthorized"`);
	    done()
	});
    });

    it("Should Allow The Admin To Log Back In", (done) => {
	Admin.login(loginCredentials)
	    .then((tok) => {
		Admin.setToken(tok);
		done()
	    })
	    .catch((err) => done(err));
    });
});

describe("Simple Admin Post Single Student Security Tests", () => {

    beforeEach((done) => {
	User.remove(
	    { $and : [
		{email : { $ne : DATA.admin.email }},
		{email : { $ne : DATA.user.email }}
	    ]}).then(() => done());
    });

    afterEach((done) => {
	User.remove(
	    { $and : [
		{email : { $ne : DATA.admin.email }},
		{email : { $ne : DATA.user.email }}
	    ]}).then(() => done());
    });

    it("Should Allow The Admin To Post A New Student User", (done) => {
	Admin.postOne(DATA.user).then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow The Admin To Post Same User Email Twice", (done) => {
	Admin.postOne(DATA.user).then((res) => done(res)).catch((err) => {
	    User.find({}).then((currentUsers) => {
		expect(currentUsers.length).toBe(2);
		done();
	    });
	});
    });

    it("Should Not Allow Unregistered Student General Access", (done) => {
	done("Not Tested");
    });

    it("Should Not Allow Unregistered Student Admin Access", (done) => {
	done("Not Tested");
    });

    it("Should Not Allow Student To Login Before Register", (done) => {
	done("Not Tested");
    });
    
    it("Should Allow The New Student To Register As Student", (done) => {
	done("Not Tested");
    });

    it("Should Not Allow Student To Login With Wrong Password", (done) => {
	done("Not Tested");
    });

    it("Should Require Student to Provide A Email and Password", (done) => {
	done("Not Tested");
    });

    it("Should Allow Registered Student To Login", (done) => {
	done("Not Tested");
    });

    it("Should Allow Logged In Student To Access Profile", (done) => {
	done("Not Tested");
    });

    it("Should Allow Student To Logout", (done) => {
	done("Not Tested");
    });
    
    it("Should Not Allow Logged Out Student General Aceess", (done) => {
	done("Not Tested");
    });

    it("Should Not Allow Logged Out Student Admin Aceess", (done) => {
	done("Not Tested");
    });

});
