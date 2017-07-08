/* NPM Modules */
const expect = require("expect");
const request = require("supertest");

/* Utility Imports */
const {UTILS} = require("./../TOOLS");
const {Tester} = require("./../TOOLS");

/* Error Imports */
const {ERRNO} = require("./../TOOLS");

/* Local Imports */
const {MongoDB} = require("./../MongoDatabase.js");
const {app} = require("./LocalMongoServer.js");
const {Play} = require("./../MongoModels");
var {DATA} = require("./LocalData.js");

"use strict";

/* Remove all Plays data before each unit test */
beforeEach((done) => {
    Play.remove({}).then(() => {
	done();
    });
});

/* Clean up the databasee after each unit test */
afterEach((done) => {
    Play.remove({}).then(() => {
    	done();
    })  
});

const PlayTester = new Tester(app, Play);

// describe("Simple Play Unit Tests", () => {

//     it("Should Create And Query A Play By ID", (done) => {
// 	PlayTester.add(DATA.onePlay)
// 	    .then(() => done()).catch((err) => done());
//     });

//     it("Should Not Reinsert A Duplicate Play", (done) => {
//     	PlayTester.duplicateAdd(done, DATA.onePlay);
//     });

//     it("Should Query And Update A Play By ID", (done) => {
// 	PlayTester.queryUpdateID(done,DATA.onePlay, {authorLast : "Martin"});
//     });

//     it("Should Query And Update A Play By Property", (done) => {
// 	PlayTester.queryUpdateProp(done, DATA.onePlay,
// 				   {genre : "Drama"}, {genre : "New Age"});
//     });

//     it("Should Query By Property And Update A Play By ID", (done) => {
// 	PlayTester.queryProp_UpdateID(done, DATA.onePlay,
// 				      {copies : 1}, {copies : 9000});
//     });

//     it("Should Query By Id and Update A Play By Property", (done) => {
// 	PlayTester.queryID_UpdateProp(done, DATA.onePlay,
// 				      {hasSpectacle : false}, {copies : 9000});
//     });

//     it("Should Delete Delete A Play By ID ", (done) => {
// 	PlayTester.queryDeleteID(done, DATA.onePlay);
//     });

//     it("Should Delete A Play By Property ", (done) => {
// 	PlayTester.queryDeleteProp(done, DATA.onePlay,
// 				   {timePeriod : "Not Specified"}, true);
//     });

//     it("Should Detect That The Query is Not in Sync With Plays", (done) => {
// 	PlayTester.badQuery(done, DATA.oneUser, {Coke : ">Pepsi"});
//     });

//     it("Should Not Allow Bad JSON Data to Be Added to the Database", (done) => {
// 	PlayTester.badAddition(done, {GOOD : "C", BAD : "C++"});
//     });
// });

// describe("Multple Plays Unit Tests", () => {

//     it("Should Create Multiple Plays", (done) => {
// 	PlayTester.addMultiple(DATA.fivePlays)
// 	    .then(() => done()).catch((err) => done(err));
//     });
// });

