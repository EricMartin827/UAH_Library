/**
 * Mongo.js is a module which provides a generic wrapper object/class
 * allowing multiple Mongoose Models to be accessed via a common
 * interface in the main server. The module reduces the code
 * size of the server. The interface cleans up and verifies client data before
 * attempting to access the databse. The interface also perfroms
 * error checks to ensure the integrity of the database while providing
 * informative error reports to the client program and the developer :).
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

function initOneDoc(Model, newEntry) {

    if (newEntry._id || newEntry.__v) {
	throw makeErrno(ECINVAL,
			`Attempted To Create A Document With Mongo ID`);
    }
    strip(Model, newEntry)

    return new Model(newEntry);
}

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

var Interface = {

    /********************************************/
    /******** Single Document Interface *********/
    /********************************************/

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
