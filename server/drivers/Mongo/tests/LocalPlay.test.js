
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

describe("Manipulating A Single Play", () => {

    /* Access Test Data */
    var clientDataArray = DATA.onePlay;
    var play = clientDataArray[0];
    
    it("Test The Creation of a Single Play", (done) => {

	   request(app)
	       .post("/testOnePlay")
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
		Play.find().then(
		    (serverDocArray) => {
			
			var serverPlay = serverDocArray[0];
			expect(serverDocArray.length).toBe(1);
			expect(verifyClientServer(play, serverPlay))
			    .toBe(true);
			return done();
		    },
		    (err) => {
			return done(err);
		    });
	    });		    
    });

    it("Test That The Same Play Cannot Be Reinserted", (done) => {

	/* Resend The Exact Same Data */
	request(app)
	    .post("/testOnePlay")
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

    it("Test That The Play Can Be Updated", (done) => {

	/* Make Changes to the Client's Play and Post For An Update */
	play.timePeriod = "18th Century";
    	play.copies = 9000;
	request(app)
	    .post("/testUpdateOnePlay")
	    .send([play])
	    .expect(200)
	    .end((err, res) => {

		/* There Should Not Be A Server Error */
		if (err) {
		    return done(error);
		}

		
	    })

	/* Query Previous Play Entry */
    	Play.find(play).then((serverDocArray) => {
	    var serverPlay = serverDocArray[0];

	    /* Verify Database Is Not Corrupted */
    	    assert.ok(serverDocArray.length === 1);
    	    expect(verifyClientServer(play, serverPlay)).toBe(true);

	    /* Make Changes To The Client's Play */
    	    play.timePeriod = "18th Century";
    	    play.copies = 9000;
	    
	    Play.update(play).then(
		(res) => {

		    /* Server AWKS Success */
		    expect(res.n).toBe(1);
		    expect(res.nModified).toBe(1);
		    expect(res.ok).toBe(1);

		    /* Requery the Database for Updated Play */
		    Play.find(play).then(
			(serverDocArray) => {

			    /* Verify That The Server is Correctly Updated */
			    serverPlay = serverDocArray[0];
			    expect(serverDocArray.length).toBe(1);
			    expect(verifyClientServer(play, serverDocArray[0]))
				.toBe(true);
			    done();
			},

			/* Error While Finding Play*/
			(err) => {
			    done(err);
			})
		},

		/* Error While Updating Play */
		(err) => {
		    
		    done(err);
		});
	});
    });

    it("Test That A Play Cannot Be Saved With Undeclared Attrbutes", (done) => {
	
	done();
    });
});
