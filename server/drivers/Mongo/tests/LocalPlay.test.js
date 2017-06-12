const expect = require("expect");
const request = require("supertest");
const assert = require("assert");

const {TEST_UTILS} = require("./../TOOLS");
const {UTILS} = require("./../TOOLS");
const {CONSTANTS} = require("./../TOOLS");

const {app} = require("./LocalMongoServer.js");
const {Play} = require("./../MongoModels");

const {verifyClientServer} = TEST_UTILS;
const {printObj} = UTILS;

var {DATA} = require("./PlayData.js");


/* Clear the data base before each test */
beforeEach((done) => {
    Play.remove({}).then(() => {
	done();
    });
});


describe("POST /testOnePlay", () => {
    
    var clientData = play = DATA.onePlay;
    
    it("\n\tTests The Creation of a Single Play\n" +
       "\tTests That The Same Play Cannot Be Reinserted\n" +
       "\tTests That The Attributes Can Be Updated\n" +
       "\tTests That The Changing Key Names Cannot Create Duplicate",
       (done) => {
	   request(app)
	       .post("/testOnePlay")
	       .send(clientData)
	       .expect(200)
	       .expect((res, err) => {
		   
		   expect(verifyClientServer(clientData, res.body))
		       .toBe("VERIFIED");
	       })
	       .expect((res) => {
	       	   request(app)
	       	       .post("/testOnePlay")
		       .send(clientData)
		       .expect(400)
		       .end((err, res) => {
			   if (err) {
			       return done(err);
			   }
			   assert.ok(res.clientError);
			   assert.ok(!res.serverError);
			   assert.ok(res.body.code === 11000);
			   console.log(res.body.code);
			   console.log(res.body.errmsg);
			   done();
		       });
	       })
	       .end((err, res) => { /* This is the end of the chain !!!*/

		   if (err) {
		       return done(err);
		   }
		   Play.find().then((plays) => {
		       expect(plays.length).toBe(1);
		       expect(verifyClientServer(play, plays[0]))
			   .toBe("VERIFIED");
		   }).catch((err) => {
		       done(err)
		   });

	       });
	   	   
       });
});
