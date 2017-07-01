/**
 * Mongo.js is a module which provides a generic wrapper object/class
 * allowing multiple Mongoose Models to be accessed via a common
 * interface in the main server. The module reduces the code
 * size of the server and cleans up/verifies client data before
 * attempting to access the databse. The interface also perfroms
 * error checks to ensure the database does not become corrupted. These
 * error reports are also used to message client programs and assist
 * development.
 *
 * @module Mongo.js
 * @author Eric William Martin
 */

/* Utilitiy Imports */
const util = require("util");
const {UTILS} = require("./TOOLS");
const {isFunc} = UTILS;
const {stringify} = UTILS;
const {isObject} = UTILS;
const {isValidID} = UTILS;
const {isEmptyObject} = UTILS;

/* Error Imports */
const {NODE_ERRORS} = require("./TOOLS");
const {CUSTOM_ERRNO} = NODE_ERRORS;
const {NO_CLIENT_REQUEST} = CUSTOM_ERRNO;
const {ECINVAL} = CUSTOM_ERRNO;
const {FAILED_ID_UPDATE} = CUSTOM_ERRNO;
const {FAILED_QUERY_UPDATE} = CUSTOM_ERRNO;
const {FAILED_ID_REMOVE} =  CUSTOM_ERRNO;
const {FAILED_QUERY_REMOVE} =  CUSTOM_ERRNO;
const {ESINVAL} = CUSTOM_ERRNO;
const {makeErrno} = NODE_ERRORS;


"use strict"
/**
 * The Mongo object/class is a generic wrapper. It takes a valid
 * Mongoose Model Class and extends the aformentioned model's
 * capabilities by encapsulating the model's methods within a
 * generic database interface.
 *
 * @class Mongo
 * @constructor
 * @param {Object} Model a Mongoose Model Class Contructor
 * @throws an 'InvalidServerArgument' error if Model lacks a Schema
 */
function Mongo(Model) {

    if (!(Model && isFunc(Model) && Model.schema && Model.schema.obj)) {
	throw makeErrno(ESINVAL, `Invalid Model:\n${stringify(Model)} ` +
			`No Schema Object Present`);
    }
    this.model = Model;
}


/*
 * Private helper function which removes any property in the target object
 * not present in the model's schema prior to the object's use in database
 * operations. It's primary purpose is to ensure that the client browser can
 * never introduce new/unwanted properties witin a MongoDB Collections.
 * For example, strip() prevents the client from attaching a property such as
 * {Dog : "Rabies"} onto a collection defining Plays.
 *
 * @param {Object} a Mongoose Model used to select desired properties
 * @param {Object} client object to be cleaned before database creation
 */
function strip(Model, object) {

    delete(object["_id"]);
    delete(object["__v"]);
    for (var prop in object) {
	if (!Model.schema.obj.hasOwnProperty(prop)) {
	    var model_name = Model.collection.collectionName;
	    console.warn(`Property ${prop} not in ${model_name}`);
	    delete object[prop];
	}
    }
}

/*
 * Private helper function which works with strip() to perpare a
 * query for accessing and removing data from a MongoDB database.
 *
 * @throws an "InvalidCleintInput" if client data does not requirements
 * @return {Object} an object which can safely access the database
 */
function clean(Model, obj) {

    if (!obj || !isObject(obj)) {
	throw makeErrno(ECINVAL,
		       `Invalid Criteria ${obj} For Query/Mod Database`);
    }
    strip(Model, obj);
    if (isEmptyObject(obj)) {
	throw makeErrno(ECINVAL,
			`Client Update Failed To Comply With Model Schema`);
    }
    return obj;
}

/*
 * Private helper function which checks if a client is trying to create
 * an existing document and gnerates a single Mongoose entry which will
 * be saved in the database via the document.save() call.
 *
 * @param Model {Object} the Mongoose Model used to make the document
 * @param newEntry {Object} JSON data used to initialize the document
 */
function initOneDoc(Model, newEntry) {

    if (newEntry._id || newEntry.__v) {
	throw makeErrno(ECINVAL,
			`Attempted To Create A Document With Mongo ID`);
    }
    strip(Model, newEntry)

    return new Model(newEntry);
}

/*
 * Private helper function which checks if a client is trying to create
 * an existing document and generates multiple Mongoose entries which will
 * be saved to the database via a series of asynchronous document.save()
 * calls.
 *
 * @param Model {Object} the Mongoose Model used to make the documents
 * @param newArray {Array} the array containing entry JSON data
 */
function initMultDocs(Model, entryArray) {

    if (!Array.isArray(entryArray)) {
	throw makeErrno(ECINVAL,
			`Non Array Value Used in Multiple Document Generation`);
    }

    for (let ii = 0; ii < entryArray.length; ii++) {

	var entry = entryArray[ii];
	if (entry._id || entry.__v) {
	    throw makeErrno(ECINVAL,
			    `Attempted To Create A Document With Mongo ID`);
	}
	strip(Model, entry);
	entryArray[ii] = new Model(entry);
    }

    return entryArray;
}


/* The Public Database Interface Used To Communicate With the Database */
var Interface = Mongo.prototype;


/***********************************************************************/
/******************* Single Document Interface *************************/
/***********************************************************************/

/**
 * Function asynchronously adds a new document to the database. If the
 * client data does not meet the invoking model's criteria or if the
 * document is already present in the database, method rejects the
 * client's request.
 *
 * @method addNewDocument_ModifyDatabase
 * @param req the client's unprocessed request data
 * @return {Promise} a promise to return either added entry or an error
 */
Interface.addNewDocument_ModifyDatabase = function(req) {
    return new Promise((resolve, reject) => {
	try {
	    initOneDoc(this.model, req.body).save()
		.then((doc) => {
		    util.log("Added: ", doc.toString());
		    resolve(doc);
		})
		.catch((err) => {
		    reject(err);
		});
	} catch(err) {
	    reject(err);
	}
    });
}

/**
 * Function asynchronously searches for a document in the database. If the
 * client request does not have a valid Monog _id, the method rejects the
 * client's request.
 *
 * @method findOneByID_QueryDatabase
 * @param req the client's unprocessed request data that should have and _id
 * @return {Promise} a promise to return either added entry or an error
 */
Interface.findOneByID_QueryDatabase = function(req) {
    return new Promise((resolve, reject) => {

	var id = req.params.id;
	if (!isValidID(id)) {
	    reject(makeErrno(ECINVAL,
			     `Invalid ID ${id} Used To Query Mongo`));
	}
	this.model.findById(id)
	    .then((res) => {

		/* Resolve an empty object if there is no match */
		resolve(res ? res : {});
	    })
	    .catch((err) => reject(err));
    });
}

/**
 * Function asynchronously searches for a document in the database using a
 * client query object. If the client request does not have a valid query,
 * for the invoking model, the method will reject the client's request.
 *
 * @method findFirstOneByProp_QueryDatabase(
 * @param req the client's unprocessed request data containing a query
 * @return {Promise} a promise to return either a queried entry or an error
 */
Interface.findFirstOneByProp_QueryDatabase = function(req) {
    return new Promise((resolve, reject) => {

	try {
	    var query = clean(this.model, req.body);
	} catch (err) {
	    return reject(err);
	}

	this.model.findOne(query).exec()
	    .then((res) => {

		/* Resolve an empty object if there is no match */
		resolve(res ? res : {});
	    })
	    .catch((err) => {
		reject(err);
	    });
    });
}

Interface.findFirstOneByProp_UpdateDatabase = function(req) {
    return new Promise((resolve, reject) => {

	if (!req.body.query || !req.body.update) {
	    reject(mkaeErrno(ECINVAL,
			     `Client Request Does Not Specify Query/Update`));
	}
	
	try {
	    var query = clean(this.model, req.body.query);
	    var update = clean(this.model, req.body.update);
	} catch (err) {
	    reject(err);
	}

	this.model.findOneAndUpdate(query, update, {new : true})
	    .then((doc) => {
		if (!doc) {
		    reject(makeErrno(FAILED_QUERY_UPDATE,
				    `Query: ${query} Has No Match`));
		}
		resolve(doc);
	    })
	    .catch((err) => {
		reject(err);
	    });
    });
}

Interface.findOneByID_UpdateDatabase = function(req) {
    return new Promise((resolve, reject) => {

	var id = req.params.id;
	if (!isValidID(id)) {
	    reject(makeErrno(ECINVAL,
			     `Invalid ID: ${id} Used To Update Mongo`));
	}

	try {
	    var update = clean(this.model, req.body);
	} catch (err) {
	    reject(err);
	}

	this.model.findByIdAndUpdate(id, {$set : update}, {new : true})
	    .then((res) => {
		if (!res) {
		    reject(makeErrno(FAILD_ID_UPDATE,
				     `ID: ${id} not present in database`));
		}
		resolve(res);
	    })
	    .catch((err) => {
		reject(err);
	    });
    });
}

Interface.removeOneByID_ModifyDatabase = function(req) {
    return new Promise((resolve, reject) => {

	var id = req.params.id;
	if (!isValidID(id)) {
	    reject(makeErrno(ECINVAL,
			     `Invalid ID: ${id} Used To Delete Entry`));
	}

	this.model.deleteOne({_id : id})
	    .then((res) => {
		if (res.result.n === 0) {
		    reject(makeErrno(FAILED_ID_REMOVE,
				     `ID: ${id} not present in database`));
		}
		resolve(res);
	    })
	    .catch((err) => {
		reject(err);
	    });
    });
}

Interface.removeFirstOneByProp_ModifyDatabase = function(req) {
    return new Promise((resolve, reject) => {

	try {
	    var query = clean(this.model, req.body);
	} catch (err) {
	    reject(err);
	}

	this.model.deleteOne(query)
	    .then((res) => {
		if (res.result.n === 0) {
		    reject(makeErrno(FAILED_QUERY_REMOVE,
				     `\nQuery: ${stringify(query)} not ` +
				     `in database`));
		}
		resolve(res);
	    })
	    .catch((err) => {
		reject(makeErrno(ESINVAL,
				`Query: ${query} Violcated Database Protocol`));
	    });
    });
}

/********************************************/
/******* Multiple Document Interface ********/
/********************************************/

Interface.addMultipleDocuments_ModifyDatabase = async function(req) {

    var docs = initMultDocs(this.model, req.body);
    for (let ii = 0; ii < docs.length; ii++) {
	docs[ii] = await docs[ii].save();
    }
    return docs;
}

module.exports = {Mongo};
