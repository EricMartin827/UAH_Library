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
	done(1);
    });

    it("Should Query By Properties And Update A Play By ID", (done) => {
	PlayTester.queryProp_UpdateID(
	    DATA.onePlay, {copies : 1}, {copies : 9000})
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Query By Id and Update A Play By Property", (done) => {
	done(1);
    });

    it("Should Query and Delete Delete A Play By ID ", (done) => {
	done(1);
    });

    it("Should Query and Delete Delete A Play By Propery ", (done) => {
	done(1);
    });
});

