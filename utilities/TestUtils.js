/* NPM Imports */
const expect = require("expect");
const request = require("supertest");

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
const {makeErrno} = NODE_ERRORS;

"use strict"



function Tester(app, model) {

    if (!(model && isFunc(model) && model.collection &&
	  model.collection.collectionName)) {
	throw makeErrno(ECINVAL, `Invalid Model:\n${stringify(model)} ` +
			`No Model Collection Name Present`);
    }
    this.app = app;
    this.mode = model.collection.collectionName;
}

function verifyClientServer(clientData, serverDoc, ignore) {

    if (arguments.length < 2) {
	return console.error("verifyClientServer requires client and server data, " +
		      "and a constructor");
    }

    if (Array.isArray(clientData) || !isObject(clientData)) {
	return console.error("Client Data Cannot Be An Array : Must Be an Object");
    }

    if (!isObject(serverDoc) || !serverDoc._id) {
	return console.error("Server Response Lacks Mongo Document ID");
    }

    ingnore = (ignore && Array.isArray(ignore)) ? new Set(ignore) : new Set();

    for (var prop in clientData) {
	if (!serverDoc.hasOwnProperty(prop) || ingnore.has(prop)) {
	    continue;
	}
	if (isObject(clientData[prop])) {
	    expect(clientData[prop]).toEqual(serverDoc[prop]);
	} else {
	    expect(clientData[prop]).toBe(serverDoc[prop]);
	}
    }
    return true;
}

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
		expect(verifyClientServer(json, doc))
		    .toBe(true);
	    })
	    .end((err, res) => {

		if (err) {
		    return reject(err);
		}

		/* Retrieve data to confirm that json data is present 
		 * and valid.
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
			expect(verifyClientServer(json, res.body))
			    .toBe(true);
			return resolve(res.body);
		    })
	    })
    });
}

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

function getID(_app, _mode, id) {

    return new Promise((resolve, reject) => {

	request(_app)
	    .get(`/getID/${_mode}/${id}`)
	    .expect(200)
	    .expect((res, err) => {

		if (err) {
		    reject(err);
		}

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

function updateProp(_app, _mode, query, update) {
    return null;
}

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

function remove(_app, _mode, query) {
    return null;
}

function removeID(_app, _mode, id) {

    return new Promise((resolve, reject) => {

	request(_app)
	    .delete(`/removeID/${this.mode}/${id}`)
	    .expect(200)
	    .expect((res, err) => {

		if (err) {
		    reject(err);
		}

		var awk = res.body;
 		expect(awk.n).toBe(1);
		expect(awk.ok).toBe(1);

		request(_app)
		    .get('/getID/${_mode}/${res.body._id}')
		    .expect(400)
		    .end((err, res) => {
			expect(res.clientError).toBe(true);
			expect(res.serverError).toBe(false);
			expect(ERRNO[res.body.code]).toBe("Removal_ID_Miss");
		    })
		
	    }).catch((err) => {
		reject(err);
	    })
    });
}

/*
 * Alias the contrcutor's prototype so that we can use previously
 * built interface functions within the same interface. The use of
 * _app/_mode allows the code to bypass the overwrite of 'this' when
 * the new operator is used to construct the promise.
 */
var Interface = Tester.prototype;

Interface.add = function(json) {
    return add(this.app, this.mode, json);
}

Interface.get = function(query) {
    return get(this.app, this.mode, query);
}

Interface.getID = function(id) {
    return getID(this.app, this.mode, id);
}

Interface.updateProp = function(query, update) {
    return updateProp(this.app, this.mode, query, update);
}

Interface.updateID = function(id, update) {
    return updateID(this.app, this.mode, id, update);
}

Interface.remove = function(query) {
    return remove(this.app, this.mode, query);
}

Interface.removeID = function(id) {
    return removeID(this.app, this.mode, id);
}

/********************************************************/
/**************Generic Suite Tests***********************/
/********************************************************/

Interface.duplicateAdd = async function(json) {
    

    /* Use JS's async/await to wait for the test play to
     * be added and verified in the database. If there is
     * error, catch and throw it. All returns/throws map
     * to resolves/rejects within an async function. Async
     * functions return Promises. ;)
     */
    await add(this.app, this.mode, json);

    /* Resend the exact same data */
    request(this.app)
	.post(`add/{this.mode}`)
	.send(json)
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

    var queried = await get(this.app, this.mode, query);
    expect(added).toEqual(queried);

    var updated = await updateID(id, update);
    Object.assign(queried, update);
    expect(updated).toEqual(queried);

}

Interface.queryProp_UpdateID = async function(json, query, update) {

    var added = await add(this.app, this.mode, json);
    
    var queried = await get(this.app, this.mode, query);
    expect(added).toEqual(queried);

    var updated = await updateID(this.app, this.mode, queried._id, update);
    Object.assign(queried, update);
    expect(updated).toEqual(queried);
    
}

module.exports = {Tester}
