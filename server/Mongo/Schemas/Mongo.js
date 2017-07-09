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
"use strict"

/* Utilitiy Imports */
const {LIBRARY} = require("./LIB");
const {NODE_LIB} = LIBRARY;
const {CUSTOM_LIB} = LIBRARY;

const {util} = NODE_LIB;
const {isSchema} = CUSTOM_LIB;
const {isFunc} = CUSTOM_LIB;
const {stringify} = CUSTOM_LIB;
const {isObject} = CUSTOM_LIB;
const {isValidID} = CUSTOM_LIB;
const {isEmptyObject} = CUSTOM_LIB;
const {isNumber} = CUSTOM_LIB;

/* Error Imports */
const {ERROR_LIB} = require("./LIB");
const {CUSTOM_ERRNO} = ERROR_LIB;
const {makeErrno} = ERROR_LIB;
const {logErrno} = ERROR_LIB;
const {logMongooseError} = ERROR_LIB;

const {NO_CLIENT_REQUEST} = CUSTOM_ERRNO;
const {ECINVAL} = CUSTOM_ERRNO;
const {FAILED_ID_UPDATE} = CUSTOM_ERRNO;
const {FAILED_QUERY_UPDATE} = CUSTOM_ERRNO;
const {FAILED_ID_REMOVE} =  CUSTOM_ERRNO;
const {FAILED_QUERY_REMOVE} =  CUSTOM_ERRNO;
const {ESINVAL} = CUSTOM_ERRNO;

/**
 * The Mongo object/class is a generic wrapper. It takes a valid
 * Mongoose Model Class and extends the aformentioned model's
 * capabilities by encapsulating the model's methods within a
 * generic database interface.
 *
 * @class Mongo
 * @constructor
 * @param Model a Mongoose Model Class Contructor
 * @throws'InvalidServerArgument' Error if Model lacks a Schema
 */
function Mongo(Model) {

    if (!isSchema(Model)) {
	throw makeErrno(ESINVAL, `Invalid Model:\n${stringify(Model)} ` +
			`No Schema Object Present`);
    }
    this.model = Model;
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
 * @method addNewEntry_ModifyDatabase
 * @param req the client's unprocessed request data
 * @return {JS Promise} a promise to return either added entry or an error
 */
Interface.addNewEntry_ModifyDatabase = function(req, res) {

    var entry = new this.model(req.body);
    entry.save().then(() => {
	res.send(entry)
    }).catch((err) => {
	if (err.code) {
	    logErrno(err);
	} else {
	    logMongooseError(err);
	}
	res.status(400).send(err);
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
	    reject(makeErrno(ECINVAL,
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

/***********************************************************************/
/******************* Multiple Document Interface ***********************/
/***********************************************************************/

Interface.addMultipleDocuments_ModifyDatabase = async function(req) {

    var docs = initMultDocs(this.model, req.body);
    for (let ii = 0; ii < docs.length; ii++) {
	docs[ii] = await docs[ii].save();
    }
    return docs;
}

Interface.findMultipleDocuments_QueryDatabase = function(req) {

    return new Promise((resolve, reject) => {

	var lim = (isNumber(req.params.limit)) ? req.params.limit : 25;
	var sort = req.params.sort;

	this.model.where().limit(lim).exec().
	    then((docs) => {
		resolve(docs);
	    }).
	    catch((err) => {
		reject(err);
	    })
    });
}

module.exports = {Mongo};
