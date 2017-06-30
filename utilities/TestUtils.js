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
 * @param {Object} an express application/a running server application
 * @param {Object} a Mongoose Model Class Constructor
 * @example
 *     var PlayTester = new Tester(Play)
 *     PlayTester.duplicateAdd(data) -> tests adding to identical plays
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
 * These private functions are necessary because when the code contructs a
 * Promise with [ new Promise(...) ], the 'this' reference is modified to
 * point to the Promise instance, not the Tester instance. In short, the code
 * needs _app and _mode since this.app and this.mode will be undefined within
 * the Promise. The public interface functions pass the app and the mode to
 * the private inner functions. Ex: [add(this.app, this.mode, json)]
 * 
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
	    .expect((res, err) => {

		if (err) {
		    return err;
		}

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

/* Private Helper for updateProp */
function updateProp(_app, _mode, query, update) {

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

/**************************************************************************/
/************************** Public Interface  *****************************/
/**************************************************************************/

/*
 * Alias the Interface with Tester's prototype. Allows any instance of
 * Tester generated via 'new Tester(Model)' to access the public testing
 * utilities/functions.
 */
var Interface = Tester.prototype;

/**
 * Function asynchronously tests adding JSON data to a database collection.
 * The JSON data being added should match the calling instance's mode. If
 * the JSON data is not successfully added, add() will either kill the unit
 * test or return an error.
 *
 * @method add
 * @param json JSON data to be added to the database
 * @return {Promise} a promise to return the added entry or terminates the test
 */
Interface.add = function(json) {
    return add(this.app, this.mode, json);
}

/**
 * Function asynchronously tests fetching JSON data from a database collection
 * using a query. The query should match the calling instance's mode.
 *
 * @method get
 * @param query the JSON data used to query the database
 * @return {Promise} a promise to return the first document matching the query
 */
Interface.get = function(query) {
    return get(this.app, this.mode, query);
}

/**
 * Function asynchronously tests fetching JSON data from a database collection
 * using an _id. The _id should match the calling instance's mode. In otherword,
 * if the current mode is 'Plays', then the _id can only return a result if the
 * _id belongs to a Plays document.
 *
 * @method getID
 * @param id the document _id used to query the database collection
 * @return {Promise} a promise to return the first document matching the query
 */
Interface.getID = function(id) {
    return getID(this.app, this.mode, id);
}

/**
 * Function asynchronously tests updating a database doucment using a query
 * to locate the document. The query should match the calling instance's mode.
 *
 * @method updateProp
 * @param query the JSON data used to query the database
 * @param update the change to make to the database entry
 * @return {Promise} a promise to return the updated document matching the query
 */
Interface.update = function(query, update) {
    return updateProp(this.app, this.mode, query, update);
}

/**
 * Function asynchronously tests updating a database doucment using an id.
 * to locate the document. The _id should match the calling instance's mode.
 *
 * @method updateID
 * @param id the document id JSON used to query the database collection
 * @param update the change to make to the database entry
 * @return {Promise} a promise to return the updated document matching the id
 */
Interface.updateID = function(id, update) {
    return updateID(this.app, this.mode, id, update);
}

Interface.remove = function(query, lastEntry) {
    return remove(this.app, this.mode, query, lastEntry);
}

Interface.removeID = function(id) {
    return removeID(this.app, this.mode, id);
}

/********************************************************/
/**************Generic Suite Tests***********************/
/********************************************************/

/*
 * JavaScript Note: The result of an 'async' function is automatically
 * casted to a Promise. Therefore the code does not directly state
 * reject(err) or resolve(res) within the scope of an 'async' function.
 * It happens under the hood; DON'T PANIC :).
 */

/**
 * Function asynchronously tests adding two identical entries to the same
 * collection/schema. Function ensures that a Duplicate Key Error is generated
 * by the server. The JSON data being added should match the calling
 * instance's mode. If the function fails to return a promise, then it either 
 * terminates the unit test or generates an error.
 *
 * @method duplicateAdd
 * @param json JSON data to be added and readded to the database
 * @return {Promise} a promise to return the added entry or terminates test
 */
Interface.duplicateAdd = async function(json) {

    /* Use JS's async/await to wait for the json data to
     * be added and verified in the database. If there is
     * error, allow the JavaScript engine to throw it up to the unit test.
     * All returns/throws map to resolves/rejects within an async function.
     * Async functions ALWAYS return Promises or an Exception. ;)
     */
    await add(this.app, this.mode, json);
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
	    util.log("Verified Duplicate Key");
	});
}

/**
 * Function asynchronously tests that the json data can be added to the database,
 * queried by it's _id, and then updated via its _id. The json data beging tested
 * should match the instance's mode.
 * 
 * @method queryUpdateID
 * @param json the JSON data to be added and queried
 * @param update the change to made on the test data in the database
 * @return {Promise} 
 */
Interface.queryUpdateID = async function(json, update) {

    var added = await add(this.app, this.mode, json);
    var id = added._id;

    var queried = await getID(this.app, this.mode, id);
    expect(added).toEqual(queried);

    var updated = await updateID(this.app, this.mode, id, update);
    Object.assign(queried, update);
    expect(updated).toEqual(queried);

}

Interface.queryUpdateProp = async function(json, query, update) {

    var added = await add(this.app, this.mode, json);
    var updated = await updateProp(this.app, this.mode, query, update);

    Object.assign(added, update);
    expect(updated).toEqual(added);
}

Interface.queryProp_UpdateID = async function(json, query, update) {

    var added = await add(this.app, this.mode, json);
    
    var queried = await get(this.app, this.mode, query);
    expect(added).toEqual(queried);

    var updated = await updateID(this.app, this.mode, queried._id, update);
    Object.assign(queried, update);
    expect(updated).toEqual(queried);
    
}

Interface.queryID_UpdateProp = async function(json, query, update) {

    var added = await add(this.app, this.mode, json);

    var queried = await getID(this.app, this.mode, added._id);
    expect(added).toEqual(queried);

    var updated = await updateProp(this.app, this.mode, query, update);
    Object.assign(queried, update);
    expect(updated).toEqual(queried);
}

Interface.queryDeleteID = async function(json) {

    var added = await add(this.app, this.mode, json);
    await removeID(this.app, this.mode, added._id);

    try {
	await removeID(this.app, this.mode, added._id)
    } catch (err) {
	expect(err.code).toBe(FAILED_ID_REMOVE);
	util.log("Verified Error");
	return;
    }
    expect(true).toBe(false);
}

Interface.queryDeleteProp = async function(json, query, lastEntry) {

    var added = await add(this.app, this.mode, json);
    await remove(this.app, this.mode, query, lastEntry)

    try {
	await remove(this.app, this.mode, query);
    } catch(err) {
	expect(err.code).toBe(FAILED_QUERY_REMOVE);
	return;
    }
    expect(true).toBe(false);
}

module.exports = {Tester}
