/* NPM Modules */
const expect = require("expect");
const request = require("supertest");

/* Custom Modules */
const {UTILS} = require("./../TOOLS");
const {Tester} = require("./../TOOLS");

/* Error Imports */
const {ERRNO} = require("./../TOOLS");

/* Local Modules */
const {MongoDB} = require("./../MongoDatabase.js");
const {app} = require("./LocalMongoServer.js");
const {User} = require("./../MongoModels");
var {DATA} = require("./LocalData.js");

"use strict";

const UserTester = new Tester(app, User);
describe("Simple User Unit Tests", () => {

    /* Remove all users before unit tests in decribe block run */
    beforeEach((done) => {
	User.remove({}).then(() => {
	    done();
	});
    });

    /* Clean up the databese after all unit tests run */
    afterEach((done) => {
	User.remove({}).then(() => {
	    done();
	});
    });

    it("Should Create And Query A User By ID", (done) => {
	UserTester.add(DATA.oneUser)
	    .then(() => done()).catch((err) => done());
    });

    it("Should Not Reinsert A Duplicate User", (done) => {
    	UserTester.duplicateAdd(done, DATA.oneUser);
    });

    it("Should Query And Update A User By ID", (done) => {
	UserTester.queryUpdateID(done, DATA.oneUser,
				 {lastName : "Sullivan"}); /* Update Via ID */
    });

    it("Should Query And Update A User By Property", (done) => {
	UserTester.queryUpdateProp(done, DATA.oneUser,
				   {lastName: "Martin"}, /* Query */
				   {firstName: "Andy"}); /* Update */
    });

    it("Should Query By Property And Update A User By ID", (done) => {
	UserTester.queryProp_UpdateID(done, DATA.oneUser,
				      {email : "ericmartin827@gmail.com"}, /* Query */
				      {firstName : "Joanne"}); /* Update Via ID */
    });

    it("Should Query By Id and Update A User By Property", (done) => {
	UserTester.queryID_UpdateProp(done, DATA.oneUser,
				      {firstName : "Eric"}, /* Update Query */
				      {firstName : "Sean"}); /* Update */
    });

    it("Should Query and Delete Delete A User By ID ", (done) => {
	UserTester.queryDeleteID(done, DATA.oneUser);
    });

    it("Should Query and Delete Delete A User By Propery ", (done) => {
	UserTester.queryDeleteProp(done, DATA.oneUser, {isAdmin: true}, true);
    });

    it("Should Detect That The Query is Not in Sync With Users", (done) => {
	UserTester.badQuery(done, DATA.oneUser, {Nappa : "Vegeta :)"});
    });

    it("Should Not Allow Bad JSON Data to Be Added to the Database", (done) => {
	UserTester.badAddition(done, {user : "Charlie", unicorns : "Steal Kidneys"});
    });

});
