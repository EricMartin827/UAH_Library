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

describe("Simple Seed Admin Security Tests", () => {

    var loginCredentials;
    before((done) => {
    	_Admin.seed(DATA.admin).then((res) => {
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

    after((done) => {
	User.remove({}).then(() => done());
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
	_User.myPage(DATA.user).then(() => done("Should Not Pass"))
	    .catch((err) => {
		expect(err.message)
		    .toBe(`expected 200 "OK", got 401 "Unauthorized"`)
		done();
	    });
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

    it("Should Allow The New Student To Register As Student and Logout",
       (done) => {
	   DATA.user.password = "R1ck@ndM0rty";
	   _User.register(DATA.user).then((tok) => {
	       
	       _User.setToken(tok);
	       _User.logout(DATA.user)
		   .then(() => done()).catch((err) => done(err));

	   }).catch((err) => done(err))
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

    it("Should Not Allow Logged In Student Admin Access", (done) => {
	_User.badAdminAccess(DATA.user)
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow Logged In Student Admin Access With Changed Token",
       (done) => {
	   _User.attackAdminAccess(DATA.user)
	       .then(() => done()).catch((err) => done(err));
       });
 
    it("Should Allow Logged In Student To Access Profile", (done) => {
	_User.myPage(DATA.user).then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow Student To Access Profile Without Token", (done) => {
	_User.myPage_NoToken().then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow Student To Access Profile With Bad Token", (done) => {
	_User.myPage_BadToken("Th1s T0k3n_wr0n%")
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow Student To Access Profile With Altered Token",
       (done) => {
	   _User.myPage_AlteredToken()
	       .then(() => done()).catch((err) => done(err));
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
});


describe("Simple Admin Post Single Admin Security Tests", () => {

    var _newAdmin = new AdminTester(main, User);

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
	User.remove(
	    { $and : [
		{email : { $ne : DATA.admin.email }},
		{email : { $ne : DATA.newAdmin.email }}
	    ]}).then(() => done());
    });

    afterEach((done) => {
	User.remove(
	    { $and : [
		{email : { $ne : DATA.admin.email }},
		{email : { $ne : DATA.newAdmin.email }}
	    ]}).then(() => done());
    });

    after((done) => {
	User.remove({}).then(() => done());
    });

    it("Should Allow The Admin To Post A New Admin", (done) => {
	_Admin.postOne(DATA.newAdmin)
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow The Admin To Post Same Admin Email Twice", (done) => {
	_Admin.postOne(DATA.newAdmin).then((res) => done(res)).catch((err) => {
	    User.find({}).then((currentUsers) => {
		expect(currentUsers.length).toBe(2);
		done();
	    });
	});
    });

    it("Should Not Allow Unregistered Admin General Access", (done) => {

	_newAdmin.myPage().then(() => done("Should Not Pass"))
	    .catch((err) => {
		expect(err.message)
		    .toBe(`expected 200 "OK", got 401 "Unauthorized"`);
		done();
	    });
    });

    it("Should Not Allow Admin To Register Without a Token", (done) => {
    	_newAdmin.register_NoToken(DATA.newAdmin)
    	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow Admin To Register With a Bad Token", (done) => {
    	_newAdmin.register_BadToken(DATA.newAdmin, "mmmm....Bacon :)")
    	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow Admin To Login With Wrong Password", (done) => {
    	var email = DATA.newAdmin.email;
    	var password = "B@c0n_Wr@pped_B#Rg3r";
    	_newAdmin.badLogin({email, password})
    	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow Admin To Login Without Password Or Email", (done) => {
    	_newAdmin.badLogin()
    	    .then(() => done()).catch((err) => done(err));
    });
 
    it("Should Make Register Token On First Login Attempt", (done) => {
    	_newAdmin.login(DATA.newAdmin).then((tok => {
    	    _newAdmin.setToken(tok);
    	    done();
    	})).catch((err) => done(err));
    });

    it("Should Not Allow New Admin To Register With Altered Token", (done) => {
	_newAdmin.register_AlteredToken(DATA.newAdmin)
	    .then(() => done()).catch((err) => done(err));
    });
 
    it("Should Not Allow New Admin To Register With Same Password", (done) => {
	_newAdmin.register(DATA.newAdmin)
	    .then(() => done("Password Not Changed"))
	    .catch((err) => done());
    });

    it("Should Allow The New Admin To Register As Admin And Logout", (done) => {
	DATA.newAdmin.password = "Mr.M33SIX";
	_newAdmin.register(DATA.newAdmin)
	    .then((tok) => {

		_newAdmin.setToken(tok);
		_newAdmin.logout(DATA.newAdmin)
		    .then(() => done()).catch((err) => done(err));

	    }).catch((err) => done(err));
    });

    it("Should Not Allow Wrong Password Login After Registration", (done) => {
	var email = DATA.newAdmin.email;
	var password = "B@c0n_Wr@pped_B#Rg3r_c0n_PEANUT_BUTTER";
	_newAdmin.badLogin({email, password})
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow No Password Login After Registration", (done) => {
	_newAdmin.badLogin()
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Allow Registered Admin To Login", (done) => {
	_newAdmin.login(DATA.newAdmin).then((tok) => {
	    _newAdmin.setToken(tok);
	    done()
	}).catch((err) => done(err));
    });

    it("Should Allow The New Admin To Access Personal Profile", (done) => {
	_newAdmin.myPage().then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow New Admin Access With No Token", (done) => {
	_newAdmin.myPage_NoToken().then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow New Admin Access With Invalid Token", (done) => {
	_newAdmin.myPage_BadToken("This token should not work")
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow New Admin Access With AlteredToken", (done) => {
	_newAdmin.myPage_AlteredToken()
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Allow New Admin To Post Other Users and Have Admin Access",
       (done) => {
	   _newAdmin.postOne(DATA.user)
	       .then(() => {
		   User.find({access: "admin"}).then((admins) => {
		       expect(admins.length).toBe(2);
		       User.find({"access" : "user"}).then((users) => {
			   expect(users.length).toBe(1);
			   done();
		       });
		   });
	       }).catch((err) => done(err));
       });

    it("Should Allow The New Admin to Logout and Clear Their Token", (done) => {
	_newAdmin.logout(DATA.newAdmin).
	    then(() => done()).catch((err) => done(err));
    });

    it("Should Not Allow The New Admin To Their Personal Page After Logout",
       (done) => {
	   _newAdmin.myPage().then(() => {
	       done("Application Allowed Acces After Logout");
	   }).catch((err) => {
	       expect(err.message)
		   .toBe(`expected 200 "OK", got 401 "Unauthorized"`);
	       done()
	});
    });

    it("Should Allow The Admin To Log Back In", (done) => {
	_newAdmin.login(DATA.newAdmin)
	    .then((tok) => {
		_newAdmin.setToken(tok);
		done()
	    })
	    .catch((err) => done(err));
    });

    it("Should Allow New Admin To Post Another User",
       (done) => {
	   _newAdmin.postOne(DATA.fiveUsers[2])
	       .then(() => {
		   User.find({access: "admin"}).then((admins) => {
		       expect(admins.length).toBe(2);
		       User.find({"access" : "user"}).then((users) => {
			   expect(users.length).toBe(1);
			   done();
		       }).catch((err) => done(err));
		   }).catch((err) => done(err));
	       }).catch((err) => done(err));
       });
});
