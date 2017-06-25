/* NPM Imports */
const expect = require("expect"); /* Tests Return Values*/
const request = require("supertest"); /* Sends Data */

/* Utility Imports */
const {UTILS} = require("./AppUtils");
const {isFunc} = UTILS;
const {isObject} = UTILS;

/* Error Imports */
{ERRNO} = require("./ERRNO.js");
{ECINVAL} = ERRNO;

"use strict"

function Tester(app, model) {

    if (!(model && isFunc(model) && model.collection &&
	  model.collection.collectionName)) {
	throw makeErrno(ECINVAL, `Invalid Model:\n${stringify(Model)} ` +
			`No Model Collection Name Present`);
    }
    this.app = app;
    this.mode = Model.collection.collectionName;
    
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

/* Alias the contrcutors prototype */
var Interface = Tester.prototype;


Interface.add = function(json) {

    return new Promise((resolve, reject) => {

	/* Create the first entry and confirm json data was saved */
	request(this.app)
	    .post("/add/" + this.mode)
	    .send(play)
	    .expect(200)
	    .expect((res, err) => {

		if (err) {
		    reject(err);
		}

		var doc = res.body;
		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		expect(verifyClientServer(json, doc))
		    .toBe(true);
	    })
	    .end((err, res) => {

		if (err) {
		    reject(err);
		}

		/* Retrieve data to confirm that json data is present 
		 * and valid.
		 */
		request(this.app)
		.get("/getID/" + this.mode + "/" res.body._id)
		    .expect(200)
		    .expect((res, err) => {

			if (err) {
			    return err;
			}

			var doc = res.body;
			expect(res.clientError).toBe(false);
			expect(res.serverError).toBe(false);
			expect(verifyClientServer(json, doc))
			    .toBe(true);
			resolve(doc);
		    })
		    .catch((err) => {
			reject(err);
		    });
	    });
    });
}

Interface.get : function(query, json) {

    return new Promise((resolve, reject) => {

	request(this.app)
	    .get("/get/" + this.mode)
	    .send(query)
	    .expect(200)
	    .expect((res, err) => {

		if (err) {
		    return err;
		}

		var doc = res.body;
		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		if (json) {
		    expect(verifyClientServer(json, doc))
			.toBe(true);
		}
		resolve(doc);
	    })
	    .catch((err) => {
		reject(err);
	    });
    });
}

Interface.getID : function(id, json) {

    return new Promise((resovle, reject) => {

	request(this.app)
	    .get("/getID/" + this.mode + "/" id)
	    .expect(200)
	    .expect((res, err) => {

		if (err) {
		    reject(err);
		}

		var doc = res.body;
		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		if (json) {
		    expect(verifyClientServer(json, doc))
			.toBe(true);
		}
		resolve(doc);
	    })
	    .catch((err) => {
		reject(err);
	    });
    });
}

Interface.updateID : function(id, update, json) {

    return new Promise((resolve, reject) => {

	request(this.app)
	    .patch("/updateID/" + this.mode + "/" + id)
	    .send(update)
	    .expect(200)
	    .expect((res, err) =>  {

		if (err) {
		    reject(err)
		}

		var doc = res.body;
		expect(res.clientError).toBe(false);
		expect(res.serverError).toBe(false);
		if (json) {
		    Object.assign(json, update);
		    expect(verifyClientServer(json, doc))
			.toBe(true);
		    resolve(doc)
		}
	    })
	    .catch((err) => {
		reject(err);
	    });
    });
}

Interface.removeID : function(id) {

    return new Promise((resolve, reject) => {

	request(app)
	    .delete("/removeID/" + this.mode + "/" + id)
	    .expect(200)
	    .expect((res, err) => {

		if (err) {
		    reject(err);
		}

		var awk = res.body;
 		expect(awk.n).toBe(1);
		expect(awk.ok).toBe(1);

		request(app)
		    .get("/getID/" + this.mode + "/" + id)
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

module.exports = {Tester}
