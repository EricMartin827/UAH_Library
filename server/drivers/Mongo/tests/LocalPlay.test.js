/* NPM Modules */
const expect = require("expect");
const request = require("supertest");
const assert = require("assert");

/* Custom Modules */
const {TEST_UTILS} = require("./../TOOLS");
const {UTILS} = require("./../TOOLS");
const {CONSTANTS} = require("./../TOOLS");
const {ERRNO} = require("./../TOOLS");
const {verifyClientServer} = TEST_UTILS;
const {printObj} = UTILS;

/* Local Modules */
const {MongoDB} = require("./../MongoDatabase.js");
const {app} = require("./LocalMongoServer.js");
const {Play} = require("./../MongoModels");
var {DATA} = require("./LocalData.js");

"use strict";

/* Remove all Plays data before unit tests in decribe block run */
before((done) => {
    Play.remove({}).then(() => {
	done();
    });;
});

/* Clean up the databese after all unit tests run */
after((done) => {
    Play.remove({}).then(() => {
	done();
    });
});

describe("Simple Play Unit Tests", () => {

    it("Should Create And Query Via the ID of a Single Play", (done) => {

	/* Create The First Entry and Confirm Data Save is Valid */
	var play = DATA.onePlay;
	request(app)
	    .post("/add/Play")
	    .send(play)
	    .expect(200)
	    .expect((res, err) => {

		if (err) {
		    return done(err);
		}

		var doc = res.body;
		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		expect(verifyClientServer(play, doc))
		    .toBe(true);
	    })
	    .end((err, res) => {

		if (err) {
		    return done(err);
		}

		/* Reacees Database To Confirm Data is Present and Valid */
		request(app)
		    .get("/getID/Play/" + res.body._id)
		    .expect(200)
		    .expect((res, err) => {

			if (err) {
			    return done(err);
			}

			var doc = res.body;
			expect(res.clientError).toBe(false);
			expect(res.serverError).toBe(false);
			expect(verifyClientServer(play, doc))
			    .toBe(true);
			return done();
		    })
		    .catch((err) => {
			return done(err);
		    });
	    });
    });

    it("Should Not Be Able Reinsert the Same Play", (done) => {

	/* Resend The Exact Same Data */
	var play = DATA.onePlay;
	request(app)
	    .post("/add/Play")
	    .send(play)
	    .expect(400)
	    .end((err, res) => {

		/* There Should Not Be A Server Error */
		if (err) {
		    return done(err);
		}

		/* Verify The Client is At Fault and Server Detect Duplicate */
		expect(res.clientError).toBe(true);
		expect(res.serverError).toBe(false);
		expect(ERRNO[res.body.code]).toBe("DuplicateKey");
		return done();
	    });
    });

    it("Should Be Able Query By Properties And Update The Play", (done) => {

	/* Reacees Database To Confirm Data is Present and Valid */
	var play = DATA.onePlay;
	request(app)
	    .get("/get/Play")
	    .send(play)
	    .expect(200)
	    .expect((res, err) => {

		if (err) {
		    return done(err);
		}
		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		expect(verifyClientServer(play, res.body))
		    .toBe(true);

		/* Make Changes to the Client's Play and Post For An Update */
		play = res.body;
		play.timePeriod = "18th Century";
		play.copies = 50;
		request(app)
		    .patch("/updateID/Play/" + play._id)
		    .send(play)
		    .expect(200)
		    .end((err, res) => {

			/* There Should Not Be A Server Error */
			if (err) {
			    return done(err);
			}
			expect(res.clientError).toBe(false);
			expect(res.serverError).toBe(false);
			expect(verifyClientServer(play, res.body))
			    .toBe(true);
		    });
		return done();
	    })
	    .catch((err) => {
		return done(err);
	    });
    });

    it("Should Query and Delete A Play Via ID ", (done) => {

	var play = DATA.onePlay;
	request(app)
	    .get("/get/Play")
	    .send(play)
	    .expect(200)
	    .expect((res, err) => {

		if (err) {
		    return done(err);
		}
		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		expect(verifyClientServer(play, res.body))
		    .toBe(true);

		play = res.body;
		request(app)
		    .delete("/removeID/Play/" + play._id)
		    .expect(200)
		    .expect((res, err) => {

			if (err) {
			    return done(err);
			}
			var awk = res.body;
			expect(awk.n).toBe(1);
			expect(awk.ok).toBe(1);

			/* Need To Test That Proper Error Result is Returned*/
			/*Code Here :) */

			request(app)
			    .get("/get/Play")
			    .send({copies: play.copies})
			    .expect(400)
			    .end((err, res) => {

				if (err) {
				    return done(err);
				}
				expect(res.clientError).toBe(true);
				expect(res.serverError).toBe(false);
				expect(ERRNO[res.body.code]).toBe("QueryMiss");
				return done();
			    });
		    }).catch((err) => {
			return done(err);
		    });
	    })
	    .catch((err) => {
		return done(err)
	    });

    });

});


describe("Multiple Play Unit Tests", () => {

    it("Should Be Able To Create Multiple Plays", (done) => {

	var plays = DATA.fivePlays;
	request(app)
	    .post("/add/batch/Play")
	    .send(plays)
	    .expect(200)
	    .end((err, res) => {

		if (err) {
		    return done(err);
		}

		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		for (var ii = 0; ii < plays.length; ii++) {
		    expect(verifyClientServer(plays[ii], res.body[ii]))
			.toBe(true);
		}
		return done();
	    });
    })
});
