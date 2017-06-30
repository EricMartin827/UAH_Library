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
	})
    });

    it("Should Create And Query A User By ID", (done) => {
	UserTester.add(DATA.oneUser)
	    .then(() => done()).catch((err) => done());
    });

    it("Should Not Reinsert A Duplicate User", (done) => {
    	UserTester.duplicateAdd(DATA.oneUser)
    	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Query And Update A User By ID", (done) => {
	UserTester.queryUpdateID(DATA.oneUser, {lastName : "Sullivan"})
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Query And Update A User By Property", (done) => {
	UserTester.queryUpdateProp(
	    DATA.oneUser, {lastName: "Martin"}, {firstName: "Andy"})
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Query By Property And Update A User By ID", (done) => {
	UserTester.queryProp_UpdateID(
	    DATA.oneUser, {userName : "eMart"}, {userName : "Joanne"})
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Query By Id and Update A User By Property", (done) => {
	UserTester.queryID_UpdateProp(
	    DATA.oneUser, {firstName : "Eric"}, {firstName : "Sean"})
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Query and Delete Delete A User By ID ", (done) => {
	UserTester.queryDeleteID(DATA.oneUser).
	    then(() => done()).catch((err) => done(err));
    });

    it("Should Query and Delete Delete A User By Propery ", (done) => {
	UserTester.queryDeleteProp(
	    DATA.oneUser, {isAdmin: true}, true)
	    .then(() => done()).catch((err) => done(err));
    });

});
