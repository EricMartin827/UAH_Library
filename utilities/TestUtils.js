/**
 * Tester.js is generic testing module which provides a uniform interface
 * for quickly testing backend database operations via the API. Any generic
 * database operation such as addition, deletion, queries, and update
 * can be teseted through Tester.js's interface via simple funtions calls such
 * as add(), get(), getID(), remove(), etc. Each call is an asynchronous
 * database operation, therefore every function call returns a Promise.
 * This allows the unit testers which use this interface to 'synchronously'
 * write database operations though Javascript's built-in async/await feature.
 * Tester.js also provides generic test suites common to all collections/schemas
 * which can be used to speed up testing new database schemas.
 *
 * Testing objects generated via the Tester.js module, will perform operations
 * on their specified collection/schema. In otherwords, if a test for plays is
 * created by 'var PlayTester = new Tester(Play)', then all database operations
 * will be centered on the Play's collection/schema in the database.
 *
 * @module Tester.js
 * @author Eric William Martin
 */

/* NPM Imports */
const expect = require("expect");
const request = require("supertest");
const util = require("util");

/* Utility Imports */
const {UTILS} = require("./AppUtils");
const {isFunc} = UTILS;
const {isObject} = UTILS;
const {stringify} = UTILS;
const {isValidID} = UTILS;

/* Error Imports */
const {NODE_ERRORS} = require("./ERRNO.js");
const {ERRNO} = NODE_ERRORS;
const {ECINVAL} = NODE_ERRORS;
const {FAILED_ID_UPDATE} = NODE_ERRORS;
const {FAILED_QUERY_UPDATE} = NODE_ERRORS;
const {FAILED_ID_REMOVE} = NODE_ERRORS;
const {FAILED_QUERY_REMOVE} = NODE_ERRORS;
const {makeErrno} = NODE_ERRORS;

"use strict"
/**
 * The Tester object/class is a generic testing interface. It takes a running
 * express application (an active server connection) and a valid Mongoose
 * Model class to generate a testing object which can quicky test and validate
 * database operations on the given Mongoose Model.
 *
 * @class Tester
 * @constructor
 * @param app an acitve NPM Express server
 * @param model a Mongoose model class constructor
 * @example
 *     // Tests adding a play to the database managed by app
 *     var PlayTester = new Tester(app, Play);
 *     PlayTester.add(data);
 */
function Tester(app, model) {

    if (!(model && isFunc(model) && model.collection &&
	  model.collection.collectionName)) {
	throw makeErrno(ECINVAL, `Invalid Model:\n${stringify(model)} ` +
			`No Model Collection Name Present`);
    }
    this.app = app;
    this.mode = model.collection.collectionName;
}

/*
 * Private helper function which is used to verify that the client JSON
 * data matches the new saved server document in the database. This function
 * is used inside the public add() function to allow client's to check if their
 * request was correctly added to the database. If a server hides certain data,
 * such as a user's password, then verify() safely ingnores the comparing the
 * hidden attribute.
 *
 * @param clientJSON client's json data to be save in the database
 * @param serverDoc server's response following a client's save request
 * @return true if client data matches server document, undefined otherwise
 */
function verify(clientJSON, serverDoc) {

    if (arguments.length < 2) {
	return console.error("verify requires client and server data");
    }

    if (Array.isArray(clientJSON) || !isObject(clientJSON)) {
	return console.error("Client Data Must Be an Object");
    }

    if (!isObject(serverDoc) || !serverDoc._id) {
	return console.error("Server Response Lacks Mongo Document ID");
    }

    for (var prop in clientJSON) {
	if (!serverDoc.hasOwnProperty(prop)) {
	    continue;
	}
	if (isObject(clientJSON[prop])) {
	    expect(clientJSON[prop]).toEqual(serverDoc[prop]);
	} else {
	    expect(clientJSON[prop]).toBe(serverDoc[prop]);
	}
    }
    return true;
}

/*
 * The following private functions are the workhorses of the Tester module.
 * These function are wrapped by their respective public interface functions
 * and actually add, delete, query, and modify the target database. These
 * functions also check that the client and server are communicating with the
 * proper protocol messages and that the database has the correct state.
 *
 * These private functions are necessary because when the code constructs a
 * Promise with [ new Promise(...) ], the 'this' reference is modified to
 * point to the Promise instance, not the Tester instance. In short, the code
 * needs _app and _mode since this.app and this.mode will be undefined within
 * the Promise. The public interface functions pass the app and the mode to
 * the private inner functions. Ex: [add(this.app, this.mode, json)]
 */

/**************************************************************************/
/***************************Private Helpers *******************************/
/**************************************************************************/

/* Private Helper for Add */
function add(_app, _mode, json) {

    return new Promise((resolve, reject) => {

	/* Create the first entry and confirm json data was saved */
	request(_app)
	    .post(`/add/${_mode}`)
	    .send(json)
	    .expect(200)
	    .expect((res, err) => {

		if (err) {
		    return reject(err);
		}

		var doc = res.body;
		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		expect(verify(json, doc)).toBe(true);
	    })
	    .end((err, res) => {

		if (err) {
		    return reject(err);
		}

		/* Retrieve data to confirm that server document
		 * matches the client's json data.
		 */
		request(_app)
		    .get(`/getID/${_mode}/${res.body._id}`)
		    .expect(200)
		    .end((err, res) => {
			if (err) {
			    return reject(err);
			}
			expect(res.clientError).toBe(false);
			expect(res.serverError).toBe(false);
			expect(verify(json, res.body)).toBe(true);
			return resolve(res.body);
		    })
	    })
    });
}

/* Private Helper for Get */
function get(_app, _mode, query) {

    return new Promise((resolve, reject) => {

	request(_app)
	    .get(`/get/${_mode}`)
	    .send(query)
	    .expect(200)
	    .expect((res) => {

		var doc = res.body;
		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		return resolve(doc);
	    })
	    .catch((err) => {
		return reject(err);
	    });
    });
}

/* Private Helper for getID */
function getID(_app, _mode, id) {

    return new Promise((resolve, reject) => {

	request(_app)
	    .get(`/getID/${_mode}/${id}`)
	    .expect(200)
	    .expect((res) => {

		var doc = res.body;
		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		resolve(doc);
	    })
	    .catch((err) => {
		reject(err);
	    });
    });
}

/*
 * Private helper for testing nonsense queries. Not queries that
 * could possibly return valid
 */
function getBadQuery(_app, _mode, query) {

    return new Promise((resolve, reject) => {

	request(_app)
	    .get(`/get/${_mode}`)
	    .send(query)
	    .expect(400)
	    .expect((err) => {

		expect(err.clientError).toBe(true);
		expect(err.serverError).toBe(false);
		expect(err.code).toBe(ECINVAL);
		return resolve(err);
	    })
	    .catch((err) => {
		return reject(err);
	    });
    });
}

/* Private Helper for update */
function update(_app, _mode, query, update) {

    return new Promise((resolve, reject) => {

	request(_app)
	    .patch(`/update/${_mode}`)
	    .send({query : query, update : update})
	    .expect(200)
	    .then((res) => {

		var doc = res.body;
		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		resolve(doc);
	    }).
	    catch((err) => {
		reject(err);
	    });
    });
}

/* Private Helper for updateID */
function updateID(_app, _mode, id, update) {

    return new Promise((resolve, reject) => {

	request(_app)
	    .patch(`/updateID/${_mode}/${id}`)
	    .send(update)
	    .expect(200)
	    .expect((res, err) =>  {

		if (err) {
		    reject(err)
		}

		var doc = res.body;
		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		resolve(doc)
	    })
	    .catch((err) => {
		reject(err);
	    });
    });
}

/*
 * Private helper for testing nonsense queries. Not queries that
 * could possibly return valid
 */
function updateBadQuery(_app, _mode, query) {

    return new Promise((resolve, reject) => {

	request(_app)
	    .patch(`/update/${_mode}`)
	    .send(query)
	    .expect(400)
	    .expect((err) => {

		expect(err.clientError).toBe(true);
		expect(err.serverError).toBe(false);
		expect(err.code).toBe(ECINVAL);
		return resolve(err);
	    })
	    .catch((err) => {
		return reject(err);
	    });
    });
}

/* Private Helper for Remove */
function remove(_app, _mode, query, lastEntry) {

    return new Promise((resolve, reject) => {

	request(_app)
	    .delete(`/remove/${_mode}`)
	    .send(query)
	    .expect(200)
	    .then((res) => {

		/* Verify the server awks a single deletion */
		var awk = res.body;
		expect(awk.n).toBe(1)
		expect(awk.ok).toBe(1);

		/*
		 * If the unit tester expects the query to no longer
		 * match any documents in the database collection, then
		 * check that a query reaccess produces an empty object.
		 */
		if (lastEntry) {
		    request(_app)
			.get(`/get/${_mode}`)
			.send(query)
			.expect(200)
			.then((res) => {

			    var noDoc = res.body;
			    expect(res.clientError).toBe(false);
			    expect(res.serverError).toBe(false);
			    expect(noDoc).toEqual({});
			    util.log("Verified Property Deletion");
			    resolve();
			})
			.catch((err) => {
			    reject(err);
			})
		}
	    })
	    .catch((err) => {
		reject(err);
	    })
    });
}

/* Private Helper for RemoveID */
function removeID(_app, _mode, id) {

    return new Promise((resolve, reject) => {

	request(_app)
	    .delete(`/removeID/${_mode}/${id}`)
	    .expect(200)
	    .then((res) => {

		/* Verify the server awks a single deletion */
		var awk = res.body;
		expect(awk.n).toBe(1);
		expect(awk.ok).toBe(1);

		/* Reaccess databse by id to ensure the removed id misses */
		request(_app)
		    .get(`/getID/${_mode}/${id}`)
		    .expect(200)
		    .then((res) => {

			var noDoc = res.body;
			expect(res.clientError).toBe(false);
			expect(res.serverError).toBe(false);
			expect(noDoc).toEqual({});
			util.log("Verified ID Deletion");
			resolve();
		    }).catch((err) => {
			reject(err);
		    })
	    }).catch((err) => {
		reject(err);
	    })
    });
}

/*
 * Private helper for testing nonsense queries. Not queries that
 * could possibly return valid
 */
function removeBadQuery(_app, _mode, query) {

    return new Promise((resolve, reject) => {

	request(_app)
	    .delete(`/remove/${_mode}`)
	    .send(query)
	    .expect(400)
	    .expect((err) => {

		expect(err.clientError).toBe(true);
		expect(err.serverError).toBe(false);
		expect(err.code).toBe(ECINVAL);
		return resolve(err);
	    })
	    .catch((err) => {
		return reject(err);
	    });
    });
}

/**************************************************************************/
/************************** Public Interface  *****************************/
/**************************************************************************/

/*
 * Alias the Tester's prototype with Interface. Allows any instance of
 * Tester generated via 'new Tester(Model)' to access the public testing
 * functions.
 */
var Interface = Tester.prototype;

/**
 * Function asynchronously tests adding JSON data to a database collection.
 * The JSON data being added should match the calling instance's mode.
 *
 * @method add
 * @param json the raw JSON data to be added to the database
 * @return {JS Promise} a promise to resolve the newly added document stored
 *                      in the database or an error indicating test failure
 */
Interface.add = function(json) {
    return add(this.app, this.mode, json);
}

/**
 * Function asynchronously tests fetching JSON data from a database collection
 * using a query. The query should match the calling instance's mode.
 *
 * @method get
 * @param query the raw JSON data used to query the database
 * @return {JS Promise} a promise to return the first database document matching
 *                      the query or an empty object {} if no match occurs. An
 *                      error can also be generated indicating test failure.
 */
Interface.get = function(query) {
    return get(this.app, this.mode, query);
}

/**
 * Function asynchronously tests fetching JSON data from a database collection
 * using an _id. The _id should match the calling instance's mode. In
 * otherwords, if the current mode is 'Plays', then the _id can only return
 * a populated result if the _id belongs to a Play's document.
 *
 * @method getID
 * @param id the document _id used to search the database collection/mode
 * @return {JS Promise} a promise to return the mathcing database document or
 *                      an empty object {} if no match occurs. An error can
 *                      also be generated indicating test failure.
 */
Interface.getID = function(id) {
    return getID(this.app, this.mode, id);
}

/**
 * Function asynchronously tests updating a database doucment using a query
 * to locate the document. The query should match the calling instance's mode.
 *
 * @method update
 * @param query the raw JSON data used to query the database
 * @param update the raw JSON data indicating which fields to change within
 *               the selected database entry
 * @return {JS Promise} a promise to return the updated document matching the
 *                      query or an error either indicating that no document
 *                      was found or some other network/pipe/etc. error occured
 *                      causing test failure
 */
Interface.update = function(query, update) {
    return update(this.app, this.mode, query, update);
}

/**
 * Function asynchronously tests updating a database doucment using an _id.
 * to locate the document. The _id should match the calling instance's mode.
 * In otherwords, if the current mode is 'Plays', then the _id can only update
 * an populate a result if the _id belongs to a Play's document.
 *
 * @method updateID
 * @param id the document _id used to query the database collection
 * @param update the raw JSON data indicating which fields to change within
 *               the selected database entry
 * @return {JS Promise} a promise to return the updated document matching the
 *                      idor an error either indicating that no document
 *                      was found or some other network/pipe/etc. error occured
 *                      causing test failure
 */
Interface.updateID = function(id, update) {
    return updateID(this.app, this.mode, id, update);
}

/**
 * Function asynchronously tests deleting a database doucment using a query
 * to locate the document. The query should match the calling instance's mode.
 * Function can also be used to verify that there no longer exits any matching
 * documents if the unit tester expect no other matching queries.
 *
 * @method remove
 * @param query the raw JSON data used to query the database
 * @param lastEntry {Boolean} true if the unit tester expects that the queried
 *                            document to be removed is the last entry, false
 *                            or unspecified otherwise
 * @return {JS Promise} a promise to return the updated document matching the
 *                      query or an error either indicating that no document
 *                      was found or some other network/pipe/etc. error occured
 *                      causing test failure
 */
Interface.remove = function(query, lastEntry) {
    return remove(this.app, this.mode, query, lastEntry);
}

/**
 * Function asynchronously tests deleting a database doucment using an _id.
 * to locate the document. The _id should match the calling instance's mode.
 * In otherwords, if the current mode is 'Plays', then the _id can only delete
 * if the _id belongs to a Play's document.
 *
 * @method removeID
 * @param id the document _id used to query the database collection
 * @param update the raw JSON data indicating which fields to change within
 *               the selected database entry
 * @return {JS Promise} a promise to return the updated document matching the
 *                      idor an error either indicating that no document
 *                      was found or some other network/pipe/etc. error occured
 *                      causing test failure
 */
Interface.removeID = function(id) {
    return removeID(this.app, this.mode, id);
}

/********************************************************/
/**************Generic Suite Tests***********************/
/********************************************************/

/**
 * Function synchronously tests adding two identical entries to the same
 * collection/schema. Function ensures that a Duplicate Key Error is generated
 * by the server. The JSON data being added should match the calling
 * instance's mode. Function signals suceess/failure to the caller by invoking
 * the unit tester's Supertest callback function 'done'. See NPM package
 * Supetest for more information.
 *
 * @method duplicateAdd
 * @param done Supertest callback function passed by the unit tester
 * @param json the raw JSON data to be added and readded to the database
 * @example
 *     it("Should Not Double Add", (done) => {
 *          Tester.duplicateAdd(done, {JSON_DATA})
 *     });
 */
Interface.duplicateAdd = async function(done, json) {

    /* Sanity Test On Supertest's done() callback function */
    expect(isFunc(done)).toBe(true)

    /*
     * Use JS's async/await to wait for the json data to
     * be added and verified in the database.
     */
    try {
	await add(this.app, this.mode, json);
    } catch (err) {
	done(err);
    }

    /* Resend the exact same data and generate a Duplicate Key Error. */
    await request(this.app)
	.post(`/add/${this.mode}`)
	.send(json)
	.expect(400)
	.then((err) => {

	    /*
	     * Verify the client is at fault and that the server detects
	     * the duplicate.
	     */
	    expect(err.clientError).toBe(true);
	    expect(err.serverError).toBe(false);
	    expect(ERRNO[err.body.code]).toBe("DuplicateKey");
	    done()
	}).catch((err) => done(err));
}

/**
 * Function synchronously tests that a added document for a given collection
 * or shcema can be added, queried by it's id, and updated by it's id.
 * The JSON data being added should match the calling instance's mode.
 * Function signals suceess/failure to the caller by invoking the unit tester's
 * Supertest callback function 'done'. See NPM package Supetest for more
 * information.
 *
 * @method queryUpdateID
 * @param done Supertest callback function passed by the unit tester
 * @param json the raw JSON data to be added to the database for test case
 * @param update the raw JSON data specifying the changes to make to the
 *               test document
 * @example
 *     it("Should Query/Update Using an ID", (done) => {
 *          Tester.queryUpdateID(done, {JSON_DATA}, {JSON_UPDATE})
 *     });
 */
Interface.queryUpdateID = async function(done, json, update) {

    /* Sanity Test On Supertest's done() callback function */
    expect(isFunc(done)).toBe(true)

    try {

	var added = await add(this.app, this.mode, json);
	var id = added._id;

	var queried = await getID(this.app, this.mode, id);
	expect(added).toEqual(queried);

	var updated = await updateID(this.app, this.mode, id, update);

	/* Merge the update into the originally stored document */
	Object.assign(queried, update);

	/* Confirm that the database returns the correctly updated document */
	expect(updated).toEqual(queried);
	done();
    } catch(err) {
	done(err);
    }
}

Interface.queryUpdateProp = async function(done, json, query, _update) {

    expect(isFunc(done)).toBe(true)
    try {
	var added = await add(this.app, this.mode, json);
	var updated = await update(this.app, this.mode, query, _update);

	Object.assign(added, _update);
	expect(updated).toEqual(added);
	done();
    } catch(err) {
	done(err);
    }
}

Interface.queryProp_UpdateID = async function(done, json, query, update) {

    expect(isFunc(done)).toBe(true)

    try {
	var added = await add(this.app, this.mode, json);

	var queried = await get(this.app, this.mode, query);
	expect(added).toEqual(queried);

	var updated = await updateID(this.app, this.mode, queried._id, update);
	Object.assign(queried, update);
	expect(updated).toEqual(queried);
	done();
    } catch(err) {
	done(err);
    }
    
}

Interface.queryID_UpdateProp = async function(done, json, query, _update) {

    expect(isFunc(done)).toBe(true)

    try {
	var added = await add(this.app, this.mode, json);

	var queried = await getID(this.app, this.mode, added._id);
	expect(added).toEqual(queried);
	
	var updated = await update(this.app, this.mode, query, _update);
	Object.assign(queried, _update);
	expect(updated).toEqual(queried);
	done();
    } catch (err) {
	done(err);
    }
}

Interface.queryDeleteID = async function(done, json) {

    expect(isFunc(done)).toBe(true)

    try {
	var added = await add(this.app, this.mode, json);
	await removeID(this.app, this.mode, added._id);
    } catch (err) {
	return done(err);
    }
    
    try {
	await removeID(this.app, this.mode, added._id)
    } catch (err) {
	expect(err.code).toBe(FAILED_ID_REMOVE);
	return done();
    }
    return done(new Error("Failed To Verify Error Code"));
}

Interface.queryDeleteProp = async function(done, json, query, lastEntry) {

    expect(isFunc(done)).toBe(true)

    try {
	var added = await add(this.app, this.mode, json);
	await remove(this.app, this.mode, query, lastEntry)
    } catch(err) {
	return done(err);
    }

    try {
	await remove(this.app, this.mode, query);
    } catch(err) {
	expect(err.code).toBe(FAILED_QUERY_REMOVE);
	return done();
    }
    return done(new Error("Failed To Verify Error Code"));
}

Interface.badAddition = async function(done, badJSON) {

    try {
	await add(this.app, this.mode, badJSON);
	done(new Error(`Nonsense Data ${strinify(badJSON)} Entered ` +
		       `The Database`));
    } catch (err) {
	expect(err.code).toBe(ECINVAL);
	done();
    }
}

Interface.badQuery = async function(done, json, query) {

    try {
	await getBadQuery(this.app, this.mode, query);
	await updateBadQuery(this.app, this.mode, query);
	await removeBadQuery(this.app, this.mode, query);
	done()
    } catch(err) {
	done(err);
    }
}


module.exports = {Tester}
