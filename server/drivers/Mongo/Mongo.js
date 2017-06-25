/**
 * Mongo.js is a module which provides a generic wrapper object/class
 * allowing multiple Mongoose Models to be accessed via a common
 * interface in the main server. The module reduces the code
 * size of the server and cleans up/verifies client data before
 * attempting to access the databse. The interface also perfroms
 * error checks to ensure the database does not become corrupted while
 * simultaneously providing informative error reports to the client program
 * and the developer.
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

/* Error Imports */
const {NODE_ERRORS} = require("./TOOLS");
const {CUSTOM_ERRNO} = NODE_ERRORS;
const {NO_CLIENT_REQUEST} = CUSTOM_ERRNO;
const {ECINVAL} = CUSTOM_ERRNO;
const {FAILED_QUERY} = CUSTOM_ERRNO;
const {FAILED_UPDATE} =  CUSTOM_ERRNO;
const {ESINVAL} = CUSTOM_ERRNO;
const {makeErrno} = NODE_ERRORS;


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
    if ( obj === {}) {
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
var Interface = {

    /********************************************/
    /******** Single Document Interface *********/
    /********************************************/

    /**
     * Method asynchronously adds a new document to the database. If the
     * client data does not meet the invoking model's criteria or if the
     * document is already present in the database, method rejects the
     * client's request.
     *
     * @param req the client's unprocessed request data
     * @return {Promise} a promise to return either added entry or an error
     */
    addNewDocument_ModifyDatabase : function(req) {
	return new Promise((resolve, reject) => {
	    try {
		initOneDoc(this.model, req.body).save()
		    .then((res) => {
			util.log("Added: ", res.toString());
			resolve(res);
		    })
		    .catch((err) => {
			reject(err);
		    });
	    } catch(err) {
		reject(err);
	    }
	});
    },

    /**
     * Method asynchronously searches for a document in the database. If the
     * client request does not have a valid Monog _id, the method rejects the
     * client's request.
     *
     * @param req the client's unprocessed request data that should have and _id
     * @return {Promise} a promise to return either added entry or an error
     */
    findOneByID_QueryDatabase : function(req) {
	return new Promise((resolve, reject) => {

	    var id = req.params.id;
	    if (!isValidID(id)) {
		reject(makeErrno(ECINVAL,
				 `Invalid ID ${id} Used To Query Mongo`));
	    }
	    this.model.findById(id)
		.then((res) => {
		    util.log("Located: ", res.toString());
		    resolve(res);
		})
		.catch((err) => resolve(err));
	});
    },

    /**
     * Method asynchronously searches for a document in the database using a
     * client query object. If the client request does not have a valid query,
     * for the invoking model, the method will reject the client's request.
     *
     * @param req the client's unprocessed request data containing a query
     * @return {Promise} a promise to return either a queried entry or an error
     */
    findFirstOneByProp_QueryDatabase : function(req) {
	return new Promise((resolve, reject) => {

	    try {
		var query = clean(this.model, req.body);
	    } catch (err) {
		reject(err);
	    }
	    this.model.findOne(query).exec()
		.then((res) => {
		    if (!res) {
			reject(makeErrno(FAILED_QUERY,
					 `Unable to Find Entry With Query:\n` +
					 `${stringify(query)}`));
		    }
		    resolve(res);
		})
		.catch((err) => {
		    reject(err);
		});
	});
    },

    findOneByID_UpdateDatabase : function(req) {
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
		    resolve(res);
		})
		.catch((err) => {
		    reject(err);
		});
	});
    },

    removeOneByID_ModifyDatabase : function(req) {
	return new Promise((resolve, reject) => {

	    var id = req.params.id;
	    if (!isValidID(id)) {
		reject(makeErrno(ECINVAL,
				 `Invalid ID: ${id} Used To Delete Entry`));
	    }

	    this.model.deleteOne({_id : id})
		.then((res) => {
		    resolve(res);
		})
		.catch((err) => {
		    reject(err);
		});
	});
    },

    removeOneByProp_ModidyDatabase : function(req) {
	return new Promise((result, resolve) => {

	    try {
		var query = clean(this.model, req.body);
	    } catch (err) {
		reject(err);
	    }

	    this.model.deleteOne({query})
		.then((res) => {
		    resolve(res);
		})
		.catch((err) => {
		    reject(err);
		});
	});
    },

    /********************************************/
    /******* Multiple Document Interface ********/
    /********************************************/

    addMultipleDocuments_ModifyDatabase : async function(req) {

	var docs = initMultDocs(this.model, req.body);
	for (let ii = 0; ii < docs.length; ii++) {
	    docs[ii] = await docs[ii].save();
	}
		return docs;
    }
}


/* Add each interface method*/
for (var func in Interface) {
    Mongo.prototype[func] = Interface[func];
}

module.exports = {Mongo};
