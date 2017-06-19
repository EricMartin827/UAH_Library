
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

    /* Access Test Data */
    var clientDataArray = DATA.onePlay;
    var play = clientDataArray[0];
    it("Should Create And Query of a Single Play", (done) => {

	/* Create The First Entry and Confirm Data Save is Valid */
	request(app)
	    .post("/addPlay")
	    .send(clientDataArray)
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
			play = doc;
			return done();
		    })
		    .catch((err) => {
			console.log(err);
			return done(err);
		    });
	    });		    
    });

    it("Should Not Be Able Reinsert the Same Play", (done) => {

	/* Resend The Exact Same Data */
	request(app)
	    .post("/addPlay")
	    .send(clientDataArray)
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

    it("Should Be Able to Update The Play", (done) => {

	/* Make Changes to the Client's Play and Post For An Update */
	play.timePeriod = "18th Century";
    	play.copies = 9000;
	request(app)
	    .patch("/updatePlayId/" + play._id + "/" + play)
	    .send([play])
	    .expect(200)
	    .end((err, res) => {

		/* There Should Not Be A Server Error */
		if (err) {
		    return done(err);
		}

		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		expect(verifyClientServer(play, doc))
		    .toBe(true);
		return done();
	    });
    });

    // it("Test That A Play Cannot Be Saved With Undeclared Attrbutes", (done) => {
	
    // 	done();
    // });
});
