
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
describe("POST /testOnePlay", () => {

    var clientDataArray = DATA.onePlay;
    var play = clientDataArray[0];

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

    it("Test The Creation of a Single Play", (done) => {

	   request(app)
	       .post("/testOnePlay")
	       .send(clientDataArray)
	       .expect(200)
	       .expect((res, err) => {

		   var doc = res.body;
		   assert.ok(!res.clientError);
		   assert.ok(!res.serverError);
		   expect(verifyClientServer(play, doc))
		       .toBe("VERIFIED");

	       })
	       .end((err, res) => {
		   if (err) {
		       return done(err);
		   }
		   Play.find().then((serverDocArray) => {
		       expect(serverDocArray.length).toBe(1);
		       var serverPlay = serverDocArray[0];
		       
		       expect(verifyClientServer(play, serverPlay))
			   .toBe("VERIFIED");
		       console.log("Checked Instance Data");
		       done();
		   }).catch((err) => {
		       done(err)
		   });
	       });
       });

    it("Test That The Same Play Cannot Be Reinserted", (done) => {
	
	request(app)
	    .post("/testOnePlay")
	    .send(clientDataArray)
	    .expect(400)
	    .end((err, res) => {
		if (err) {
		    return done(err);
		}

		assert.ok(res.clientError);
		assert.ok(!res.serverError);
		assert.ok(ERRNO[res.body.code] === "DuplicateKey");
		console.log("Checked Error Response");
		done();
	    });
    });

    it("Test That The Play Can Be Updated", (done) => {

    	Play.find(play).then((serverDocArray) => {

	    var serverPlay = serverDocArray[0];
	    
    	    assert.ok(serverDocArray.length === 1);
    	    expect(verifyClientServer(play, serverPlay)).toBe("VERIFIED");


    	    play.timePeriod = "18th Century";
    	    play.copies = "9000";

	    /* Update the Play */
	    Play.update(play).then((res) => {

		assert(res.n === 1);
		assert(res.nModified === 1)
		assert(res.ok === 1);

	    });
    	}).catch((err) => {
    		done(err);
    	});

	Play.find(play).then((serverDocArray) => {

	    var serverPlay = serverDocArray[0];
	    
	    expect(serverDocArray.length).toBe(1);
	    expect(verifyClientServer(play, serverDocArray[0]))
		.toBe("VERIFIED");
	    
	    console.log("Checked Instance Data");
	    done();
	}).catch((err) => {
	    done(err);
	});
	
    });
});

describe("POST /testMultiPlays", () => {

    var clientDataArray = DATA.multiPlays;

    /* Remove all data before tests in decribe block run */
    before((done) => {
	Play.remove({}).then(() => {
	    done();
	});
    });

    /* Clean up the databese after all tests run in describe block */
    after((done) => {
    	Play.remove({}).then(() => {
    	    done();
    	});
    });

    it("Test Creating All Plays", (done) => {

	   request(app)
	       .post("/testMultiPlays")
	       .send(clientDataArray)
	       .expect(200)
	       .expect((res, err) => {

		   var doc = res.body;
		   assert.ok(!res.clientError);
		   assert.ok(!res.serverError);
		   expect(verifyClientServer(play, doc))
		       .toBe("VERIFIED");

	       })
	       .end((err, res) => {
		   if (err) {
		       return done(err);
		   }
		   Play.find().then((serverDocArray) => {

		       expect(serverDocArray.length).toBe(1);
		       var serverPlay = serverDocArray[0];
		       
		       expect(verifyClientServer(play, serverPlay))
			   .toBe("VERIFIED");
		       console.log("Checked Instance Data");
		       done();
		   }).catch((err) => {
		       done(err)
		   });
	       });
    });
});
