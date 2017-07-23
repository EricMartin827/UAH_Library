"use strict"

const {TestLibrary} = require("./TestLibrary.js");
const {ERRNO} = TestLibrary;
const {expect} = TestLibrary;

const {AdminTester} = require("./AdminTester.js");
const {UserTester} = require("./UserTester.js");
const {DATA} = require("./LocalData.js");

const {mainApp} = require("./LocalMongoServer.js");
const {Schemas} = require("./../Schemas");
const {Play} = Schemas;
const {User} = Schemas;

var loginCredentials;
const _Admin = new AdminTester(mainApp, User);
const _User = new UserTester(mainApp, User);

// before((done) => {
//     _Admin.seed(DATA.admin).then((res) => {
// 	loginCredentials = res;
// 	done();
//     }).catch((err) => {
// 	done(err)
//     });
// });

// after((done) => {
//     User.remove({}).then(() => done());
// });

describe("User Query Tests", () => {

    it("Should Fetch All Users", (done) => {
	done("Not Tested");
    });

});
