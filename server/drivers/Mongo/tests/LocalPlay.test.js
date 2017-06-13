const expect = require("expect");
const request = require("supertest");
const assert = require("assert");

const {DuplicateKey} = require("mongo-errors");

const {TEST_UTILS} = require("./../TOOLS");
const {UTILS} = require("./../TOOLS");
const {CONSTANTS} = require("./../TOOLS");

const {app} = require("./LocalMongoServer.js");
const {Play} = require("./../MongoModels");

const {verifyClientServer} = TEST_UTILS;
const {printObj} = UTILS;

var {DATA} = require("./PlayData.js");


describe("POST /testOnePlay", () => {

    var clientDataArray = DATA.onePlay;
    var play = clientDataArray[0];

    before((done) => {
	Play.remove({}).then(() => {
	    done();
	});
    });

    after((done) => {
	Play.remove({}).then(() => {
	    done();
	});
    })

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
		   Play.find().then((playArray) => {
		       
		       expect(playArray.length).toBe(1);
		       expect(verifyClientServer(play, playArray[0]))
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
		assert.ok(res.body.code === DuplicateKey);
		console.log("Checked Error Response");
		done();
	    });
    });

    // it("Test That The Play Can Be Updated", (done) => {

    // 	Play.find().then((playArray) => {

    // 		var serverPlay = playArray[0];

    // 		/* Sanity Check */
    // 		assert.ok(playArray.length === 1);
    // 		verifyClientServer(clientData, playArray[0])
    // 		    .toBe("VERIFIED");

    // 		serverPlay.timePeriod = "18th Century";
    // 		serverPlay.copies = "10";

		
    // 	}).catch((err) => {
    // 		done(err);
    // 	});
    //});
});

