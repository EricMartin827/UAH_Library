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
const {app} = require("./LocalMongoServer.js");
const {Play} = require("./../MongoModels");
var {DATA} = require("./PlayData.js");

"use strict";

/* Remove all data before unit tests in decribe block run */
before((done) => {
    Play.remove({}).then(() => {
	done();
    });
});

/* Clean up the databese after all unit tests run */
after((done) => {
    Play.remove({}).then(() => {
	done();
    });
});

describe("Simple Play Unit Tests", () => {

    it("Should Create And Query of a Single Play", (done) => {

	/* Create The First Entry and Confirm Data Save is Valid */
	var play = DATA.onePlay[0];
	request(app)
	    .post("/addPlay")
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
		    .get("/getPlayID/" + res.body._id)
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
	var play = DATA.onePlay[0];
	request(app)
	    .post("/addPlay")
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
	var play = DATA.onePlay[0];
	request(app)
	    .get("/getPlay")
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
		play.copies = 9000;
		request(app)
		    .patch("/updatePlayID/" + play._id) /* Specify The Play */
		    .send(play) /* Send The Update */
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
});
