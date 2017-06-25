
/* NPM Modules */
const expect = require("expect");
const request = require("supertest");

/* Utility Imports */
const {UTILS} = require("./../TOOLS");
const {isValidID} = UTILS;
const {printObj} = UTILS;
const {TEST_UTILS} = require("./../TOOLS");
const {verifyClientServer} = TEST_UTILS;

/* Error Imports */
const {ERRNO} = require("./../TOOLS");

/* Local Imports */
const {MongoDB} = require("./../MongoDatabase.js");
const {app} = require("./LocalMongoServer.js");
const {Play} = require("./../MongoModels");
var {DATA} = require("./LocalData.js");

"use strict";
/**
 * Function returns a promise which adds a play to the database
 * and verifies that that document is actually present by using
 * an id query. The database data is also compared with the client
 * data to ensure that database is correctly saving the client data.
 * 
 * @method addPlay
 * @params play {Object} JSON data of play to be added to database
 * @return {Promise} resolves if all tests pass, rejects otherwise
 */
function addPlay(play) {

    return new Promise((resolve, reject) => {

	/* Create The First Entry and Confirm Data Save is Valid */
	request(app)
	    .post("/add/Play")
	    .send(play)
	    .expect(200)
	    .expect((res, err) => {

		if (err) {
		    reject(err);
		}

		var doc = res.body;
		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		expect(verifyClientServer(play, doc))
		    .toBe(true);
	    })
	    .end((err, res) => {

		if (err) {
		    reject(err);
		}

		/* Reacees Database To Confirm Data is Present and Valid */
		request(app)
		.get("/getID/Play/" + res.body._id)
		    .expect(200)
		    .expect((res, err) => {
			if (err) {
			    return err;
			}

			var doc = res.body;
			expect(res.clientError).toBe(false);
			expect(res.serverError).toBe(false);
			expect(verifyClientServer(play, doc))
			    .toBe(true);
			resolve(doc);
		    })
		    .catch((err) => {
			reject(err);
		    });
	    });
    });
}



/**
 * Function returns a promise which deletes a play via id from the database, and
 * verifies that the document is actually removed by performing a id query
 * on the database. Function assumes that the database already contains a 
 * valid play entry. If the play object passed to the function can either be a
 * play id or a play document contianing an id.
 * 
 * @method removePlay
 * @params play {Object} the play object containing an ObjectID
 * @return {Promise} resolves if all tests pass, rejects otherwise
 */
function removePlayID(play) {
    return new Promise((resolve, reject) => {

	var id = play._id || play;
	if (!idValidID(id)) {
	    reject("INVALID ID PASSED TO removePlayID()")
	}
	
	request(app)
	    .delete("/removeID/Play/" + id)
	    .expect(200)
	    .expect((res, err) => {

		if (err) {
		    reject(err);
		}

		var awk = res.body;
 		expect(awk.n).toBe(1);
		expect(awk.ok).toBe(1);

		request(app)
		    .get("/getID/Play/" + id)
		    .expect(400)
		    .end((err, res) => {
			expect(res.clientError).toBe(true);
			expect(res.serverError).toBe(false);
			expect(ERRNO[res.body.code]).toBe("MongoID_Miss");
		    })
		
	    }).catch((err) => {
		reject(err);
	    })
    });
}


/**
 * Asynchronous function returns a promise which adds a play
 * to the database and then reattempts to reinsert the same
 * play. Functiion then verifies that the server correctly
 * handles the client error and generates an appropriate error
 * report.
 * 
 * @method addPlayDup
 * @param play {Object} JSON data of the play to be duplicated
 * @return {Promise} resolves if all tests pass, rejects otherwise
 */
async function addPlayDup(play) {

    /* Use JS's async/await to wait for the test play to 
     * be added and verified in the database. If there is
     * error, catch and throw it. All returns/throws map
     * to resolves/rejects within an async function. Async
     * functions return Promises. ;)
     */
    try {
	await addPlay(play);
    } catch(err) {
	throw err;
    }

    /* Resend the exact same data */
    request(app)
	.post("/add/Play")
	.send(play)
	.expect(400)
	.end((err, res) => {

	    /* There should be no server-side error */
	    if (err) {
		return err;
	    }

	    /* Verify the client is at fault and that the server detects
	     * the duplicate 
	     */
	    expect(res.clientError).toBe(true);
	    expect(res.serverError).toBe(false);
	    expect(ERRNO[res.body.code]).toBe("DuplicateKey");
	    return;
	});
}

/**
 * Asynchronous function returns a promise which adds a play
 * to the database, queries the play via a play property, and then
 * updates the contents of the play via id. Updates are set to
 * return the new database entry which is verfied with the client
 * data.
 * 
 * @method updatePlay
 * @param play {Object} JSON data of the play to be duplicate
 * @param update {Object} JOSN data specifying the field to change
 * @return {Promise} resolves if all tests pass, rejects otherwise
 */
async function updatePlay(play, update) {

    try {
	await addPlay(play);
    } catch(err) {
	throw err;
    }

    /* Reaccess the database via a property query */
    var query = {title : play.title}
    request(app)
	.get("/get/Play")
	.send(query)
	.expect(200)
	.expect((res, err) => {

	    if (err) {
		throw err;
	    }

	    expect(res.clientError).toBe(false);
	    expect(res.serverError).toBe(false);
	    expect(verifyClientServer(play, res.body))
		.toBe(true);

	    /* Update the client play with update for later verification */
	    for (var prop  in update) {
		play[prop] = update[prop];
	    }

	    /* Send the patch update via the play id to the server */
	    request(app)
		.patch("/updateID/Play/" + res.body._id)
		.send(update)
		.expect(200)
		.end((err, res) => {

		    /* There Should Not Be A Server Error */
		    if (err) {
			throw err;
		    }
		    var doc = res.body;
		    expect(res.clientError).toBe(false);
		    expect(res.serverError).toBe(false);
		    expect(verifyClientServer(play, doc))
			.toBe(true);
		    return doc
		});
	})
	.catch((err) => {
	    throw err;
	});
}

/**
 * Asynchronous function returns a promise to perform the following
 * tests in order...
 *    1) Add a play to the database
 *    2) Delete the play via id
 *    3) Query via id to ensure play is missing
 *    4) Query via property to ensure the play is missing
 *    5) Add the play again
 *    6) Delete the play via property
 *    7) Query via id to ensure its missing
 *    8) Query via property to ensure its missing
 * If any of the tests fail, the promise is reject. Otherwise, it resolves.
 *
 * @method updatePlay
 * @param JSON_Play {Object} JSON test data of the play to added and removed
 * @param query {Object} JOSN data specifying the properyties to remove by
 * @return {Promise} resolves if all tests pass, rejects otherwise
 */
async function deletePlaySuite(JSON_Play, query) {

    try {
	var play = await addPlay(JSON_Play);
	removePlayId(play);
    } catch (err) {
	throw err;
    }

    // request(app)
    // 	.get("/get/Play")
    // 	.send(play)
    // 	.expect(200)
    // 	.expect((res, err) => {

    // 	    if (err) {
    // 		return done(err);
    // 	    }
    // 	    expect(res.clientError).toBe(false);
    // 	    expect(res.serverError).toBe(false);
    // 	    expect(verifyClientServer(play, res.body))
    // 		.toBe(true);

    // 	    play = res.body;
    // 	    request(app)
    // 		.delete("/removeID/Play/" + play._id)
    // 		.expect(200)
    // 		.expect((res, err) => {

    // 		    if (err) {
    // 			return done(err);
    // 		    }
    // 		    var awk = res.body;
    // 		    expect(awk.n).toBe(1);
    // 		    expect(awk.ok).toBe(1);

    // 		    /* Need To Test That Proper Error Result is Returned*/
    // 		    /*Code Here :) */

    // 		    request(app)
    // 			.get("/get/Play")
    // 			.send({copies: play.copies})
    // 			.expect(400)
    // 			.end((err, res) => {

    // 			    if (err) {
    // 				return done(err);
    // 			    }
    // 			    expect(res.clientError).toBe(true);
    // 			    expect(res.serverError).toBe(false);
    // 			    expect(ERRNO[res.body.code]).toBe("QueryMiss");
    // 			    return done();
    // 			});
    // 		}).catch((err) => {
    // 		    return done(err);
    // 		});
    // 	})
    // 	.catch((err) => {
    // 	    return done(err)
    // 	});
}

describe("Simple Play Unit Tests", () => {

    /* Remove all Plays data before each unit test */
    beforeEach((done) => {
	console.log("BeforeEach Removal");
	Play.remove({}).then(() => {
	    done();
	});;
    });

    /* Clean up the databasee after each unit test */
    afterEach((done) => {
	console.log("AfterEach Removal");
    	Play.remove({}).then(() => {
    	    done();
    	});
    });

    it("Should Create And Query Via the ID of a Single Play", (done) => {
	addPlay(DATA.onePlay)
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Not Be Able Reinsert the Same Play", (done) => {
	addPlayDup(DATA.onePlay)
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Be Able Query By Properties And Update The Play", (done) => {
	updatePlay(DATA.onePlay, {copies : 9000, TimePeriod : "18th Century"})
	    .then(() => done()).catch((err) => done(err));
    });

    it("Should Query and Delete A Play Via ID and Properties ", (done) => {
	deletePlaySuite(DATA.onePlay, {genre : "Drama"})
	    .then(() => done()).catch((err) => done(err));
    });
});


describe("Multiple Play Unit Tests", () => {

    it("Should Be Able To Create Multiple Plays", (done) => {

	var plays = DATA.fivePlays;
	request(app)
	    .post("/add/batch/Play")
	    .send(plays)
	    .expect(200)
	    .end((err, res) => {

		if (err) {
		    return done(err);
		}

		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		for (var ii = 0; ii < plays.length; ii++) {
		    expect(verifyClientServer(plays[ii], res.body[ii]))
			.toBe(true);
		}
		return done();
	    });
    });

    it("Should Not Be Able to Add Duplicate Plays", (done) => {

	var plays = DATA.fivePlays
		request(app)
	    .post("/add/batch/Play")
	    .send(plays)
	    .expect(400)
	    .end((err, res) => {

		/* Theres Should Be No Server Error */
		if (err) {
		    return done(err);
		}

		expect(res.clientError).toBe(true);
		expect(res.serverError).toBe(false);
		expect(ERRNO[res.body.code]).toBe("DuplicateKey");
		return done();
	    });
    });
});


module.exports = {
    addPlay : addPlay
};
