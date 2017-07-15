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

var loginCredentials;
const _Admin = new AdminTester(mainApp, User);
const _User = new UserTester(mainApp, User);

before((done) => {
    _Admin.seed(DATA.admin).then((res) => {
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
	_Admin.login(loginCredentials)
	    .then((tok) => {
		_Admin.setToken(tok);
		done()
	    })
	    .catch((err) => done(err));
    });

    it("Should Not Allow Admin To Login With Wrong Password", (done) => {
	var email = loginCredentials.email;
	var password = "Testing Is g00d :)";
	_Admin.badLogin({email, password})
	    .then(() => done()).catch(() => done(err));
    });

    it("Should Require Admin to Provide A Email and Password", (done) => {
	_Admin.badLogin().then(() => done()).catch((err) => done(err));
    });

    it("Should Allow The Admin To Access Personal Profile", (done) => {
	_Admin.myPage().then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow Admin Access With No Token", (done) => {
	_Admin.myPage_NoToken().then(() => done()).catch((err) => done(err));
    })

    it("Should Not Allow Admin Access With Invalid Token", (done) => {
	_Admin.myPage_BadToken("This token should not work")
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow Admin Access With AlteredToken", (done) => {
	_Admin.myPage_AlteredToken()
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Allow The Admin to Logout and Clear Their Token", (done) => {
	_Admin.logout(DATA.admin).
	    then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow Admin To Their Personal Page After Logout", (done) => {
	_Admin.myPage().then(() => {
	    done("Application Allowed Acces After Logout");
	}).catch((err) => {
	    expect(err.message)
		.toBe(`expected 200 "OK", got 401 "Unauthorized"`);
	    done()
	});
    });

    it("Should Allow The Admin To Log Back In", (done) => {
	_Admin.login(loginCredentials)
	    .then((tok) => {
		_Admin.setToken(tok);
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
	_Admin.postOne(DATA.user).then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow The Admin To Post Same User Email Twice", (done) => {
	_Admin.postOne(DATA.user).then((res) => done(res)).catch((err) => {
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

    it("Should Not Allow Student To Register Without a Token", (done) => {
	_User.register_NoToken(DATA.user)
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow Student To Register With a Bad Token", (done) => {
	_User.register_BadToken(DATA.user, "mmmm....Bacon :)")
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow Student To Login With Wrong Password", (done) => {
	var email = DATA.user.email;
	var password = "B@c0n_Wr@pped_B#Rg3r";
	_User.badLogin({email, password})
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow Student To Login Without Password Or Email", (done) => {
	_User.badLogin()
	    .then(() => done()).catch((err) => done(err));
    });
 
    it("Should Make Register Token On First Login Attempt", (done) => {
	_User.login(DATA.user).then((tok => {
	    _User.setToken(tok);
	    done();
	})).catch((err) => done(err));
    });

    it("Should Not Allow Student To Register With Altered Token", (done) => {
	_User.register_AlteredToken(DATA.user)
	    .then(() => done()).catch((err) => done(err));
    });
 
    it("Should Not Allow Student To Register With Same Password", (done) => {
	_User.register(DATA.user).then(() => done("Password Not Changed"))
	    .catch((err) => done());
    });

    it("Should Allow The New Student To Register As Student", (done) => {
	DATA.user.password = "R1ck@ndM0rty";
	_User.register(DATA.user).then(() => done()).catch((err) => done(err))
    });

    it("Should Not Allow Wrong Password Login After Registration", (done) => {
	var email = DATA.user.email;
	var password = "B@c0n_Wr@pped_B#Rg3r_c0n_PEANUT_BUTTER";
	_User.badLogin({email, password})
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow No Password Login After Registration", (done) => {
	_User.badLogin()
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Allow Registered Student To Login", (done) => {
	_User.login(DATA.user).then((tok) => {
	    _User.setToken(tok);
	    done()
	}).catch((err) => done(err));
    });

    it("Should Allow Logged In Student To Access Profile", (done) => {
	_User.myPage(DATA.user).then(() => done()).catch((err) => done(err));
    });

    it("Should Allow Student To Logout", (done) => {
	_User.logout(DATA.user).then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow Student To Access Their Profile", (done) => {
	_User.myPage(DATA.user).then(() => done("Was Given Access"))
	    .catch((err) => {
		expect(err.message)
		    .toBe(`expected 200 "OK", got 401 "Unauthorized"`);
		done()
	    });
    });
    
    it("Should Not Allow Logged Out Student General Access", (done) => {
	done("Not Tested");
    });

    it("Should Not Allow Logged Out Student Admin Access", (done) => {
	done("Not Tested");
    });
});
