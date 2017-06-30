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


const PlayTester = new Tester(app, Play);
describe("Simple Play Unit Tests", () => {

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

    it("Should Create And Query A Play By ID", (done) => {
	PlayTester.add(DATA.onePlay)
	    .then(() => done()).catch((err) => done());
    });

    it("Should Not Reinsert A Duplicate Play", (done) => {
    	PlayTester.duplicateAdd(DATA.onePlay)
    	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Query And Update A Play By ID", (done) => {
	PlayTester.queryUpdateID(DATA.onePlay, {authorLast : "Martin"})
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Query And Update A Play By Property", (done) => {
	PlayTester.queryUpdateProp(DATA.onePlay,
				   {genre : "Drama"}, {genre : "New Age"})
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Query By Property And Update A Play By ID", (done) => {
	PlayTester.queryProp_UpdateID(
	    DATA.onePlay, {copies : 1}, {copies : 9000})
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Query By Id and Update A Play By Property", (done) => {
	PlayTester.queryID_UpdateProp(
	    DATA.onePlay, {hasSpectacle : false}, {copies : 9000})
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Delete Delete A Play By ID ", (done) => {
	PlayTester.queryDeleteID(DATA.onePlay)
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Delete A Play By Property ", (done) => {
	PlayTester.queryDeleteProp(
	    DATA.onePlay, {timePeriod : "Not Specified"}, true)
	    .then(() => done()).catch((err) => done(err));
    });
});

