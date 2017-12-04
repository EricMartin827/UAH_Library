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
const {CheckOut}   = Schemas;

const _Admin = new AdminTester(main, User);
const _User = new UserTester(main, User);

describe("Basic Checkout Tests", () => {

    var users = DATA.checkOutUsers;
    var userOne = users[0];
    var userTwo = users[1];
    var plays = DATA.fivePlays;

    before((done) => {
	_Admin.seed(DATA.admin).then((credentials) => {
	    _Admin.login(credentials).then((tok) => {
		_Admin.setToken(tok);
		_Admin.postMany(users).then(() => {
		    _Admin.setSchema(Play);
		    _Admin.postMany(plays).then(() => {
			done();
		    }).catch((err) => done(err));
		}).catch((err) => done(err));
	    }).catch((err) => done(err));
	}).catch((err) => done(err));
    });

    after((done) => {
    	User.remove({}).then(() => {
    	    Play.remove({}).then(() => {
    		CheckOut.remove({})
    		    .then(() => done())
    		    .catch((err) => done(err));
    	    }).catch((err) => done(err));
    	}).catch((err) => done(err));
    });

    it("Should Make Register Token On First Login Attempt", (done) => {
	_User.login(userOne).then((tok => {
	    _User.setToken(tok);
	    done();
	})).catch((err) => done(err));
    });

    it("Should Allow The New Student To Register As Student and Logout",
       (done) => {
	   userOne.password = "R1ck@ndM0rty";

	   _User.register(userOne).then((tok) => {
	       _User.setToken(tok);
	       _User.logout(userOne)
		   .then(() => done()).catch((err) => done(err));
	   }).catch((err) => done(err));
       });

    it("Should Allow Registered Student To Login", (done) => {
	_User.login(userOne).then((tok) => {
	    _User.setToken(tok);
	    done()
	}).catch((err) => done(err));
    });

    it("Should Allow The Logged in Student To View All Plays", (done) => {
	_User.setSchema(Play);
	_User.get().then((resPlays) => {
	    plays = resPlays;
	    done();
	}).catch((err) => done(err));
    });

    it("Should Allow The Student To Checkout A Play Play", (done) => {
	_User.checkOutValid(plays[0]._id)
	    .then((res) => {
		CheckOut.find({playID : plays[0]._id}).then((res) => {
		    expect(res.length).toBe(1);
		    done();
		}).catch((err) => done(err));
	    }).catch((err) => done(err));
    });

    it("Should Not Allow The Same Student To Checkout the Unavailable Play", (done) => {
	_User.checkOutInvalid(plays[0]._id).then(() => done()).catch((err) => done(err));
    });

    it("Should Allow The Same Student To Checkout Another Play", (done) => {
	_User.checkOutValid(plays[4]._id)
	    .then((res) => {
		CheckOut.find({}).then((res) => {
		    expect(res.length).toBe(2);
		    done();
		}).catch((err) => done(err));
	    }).catch((err) => done(err));
    });

    it("Should Not Allow the Same Student to Checkout the Previous Play", (done) => {
    	_User.checkOutInvalid(plays[4]._id).then(() => done()).catch((err) => done(err));
    })

    it("Should Allow The User To Logout", (done) => {
	_User.setSchema(User);
	_User.logout(userOne).then(() => done()).catch((err) => done(err));
    });

    it("Should Allow a Different User Register", (done) => {
	_User.login(userTwo).then((tok => {
	    _User.setToken(tok);
	    done();
	})).catch((err) => done(err));
    });

    it("Should Allow The New Student To Register and Logout",
       (done) => {
	   userTwo.password = "R1ck@ndM0rty";

	   _User.register(userTwo).then((tok) => {
	       _User.setToken(tok);
	       _User.logout(userTwo)
		   .then(() => done()).catch((err) => done(err));
	   }).catch((err) => done(err));
       });

    it("Should Allow The New Student to Login", (done) => {
	_User.login(userTwo).then((tok) => {
	    _User.setToken(tok);
	    _User.setSchema(Play);
	    done()
	}).catch((err) => done(err));
    });

    it("Should Allow A Different Student To Checkout the Same Play", (done) => {
	_User.checkOutValid(plays[4]._id)
	    .then((res) => {
		CheckOut.find({}).then((res) => {
		    expect(res.length).toBe(3);
		    done();
		}).catch((err) => done(err));
	    }).catch((err) => done(err));
    });

    it("Should Allow A Student to View Their Checkouts", (done) => {
	_User.getCheckOuts().then((res) => {
	    done();
	}).catch((err) => done(err));
    });
    

    it("Should Not Allow A Diffirent Student To Checkout An Unavailable Play", (done) => {
	_User.checkOutInvalid(plays[0]._id).then(() => done()).catch((err) => done(err));
    });

    it("Should Allow The Student To Return a Play/Delete a Checkout", (done) => {
	User.find({email : userTwo.email}).then((res) => {
	    var id = res[0]._id;
	    CheckOut.find({playID : plays[4]._id, userID : id}).then((res) => {
		_User.returnCheckOut(res[0]._id, id)
		    .then(() => done())
		    .catch((err) => done(err));
	    }).catch((err) => done(err));
	}).catch((err) => done(err));
    });    

});
