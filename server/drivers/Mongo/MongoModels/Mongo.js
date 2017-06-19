/* Import Node Core Modules */
const util = require("util");

/* Import and Set Up Custon Node Modules*/
const {NODE_ERRORS} = require("./../TOOLS");
const {UTILS} = require("./../TOOLS");
const {isFunc} = UTILS;
const {ERRNO} = NODE_ERRORS;
const {CUSTOM_ERRNO} = NODE_ERRORS;
const {makeErrno} = NODE_ERRORS;
const {FAILED_UPDATE} =  CUSTOM_ERRNO;
const {NO_CLIENT_REQUEST} = CUSTOM_ERRNO;
const {ObjectId} = require("mongoose").Types;
const {isObject} = UTILS;

function cleanUpdate(Model, update) {

    console.log(update);
    if (!update || !isObject(update)) {
	return null;
    }

    if (update._id) {
	delete(update.id);
    }
    
    if (update.__v) {
	delete(update.__v);
    }

    for (var prop in update) {
	if (!Model.schema.obj.hasOwnProperty(prop)) {
	    var model_name = Model.collection.collectionName;
	    console.warn(`Update property ${prop} not in ${model_name}`);
	    delete update[prop];
	}
    }
    return (update === {}) ? null : update;
}


function Mongo(Model) {

    if (!(Model && isFunc(Model) && Model.schema && Model.schema.obj)) {
	throw makeErrno(ESINVAL, "Invalid Model: No Schema Object Present");
    }
    this.model = Model;

}


var Interface = {

    addNewDocument_ModifyDatabase : function() {
	return null;
    },
    
    findOneByID_QueryDatabase : function(req) {
	return new Promise((resolve, reject) => {
	    
	    var id = req.params.id;
	    if (!id || !ObjectId.isValid(id)) {
	     	reject(makeErrno(ECINVAL,
	     			 `Invalid ID ${id} Used To Query Mongo`));
	    }
	    this.model.findById(id)
		.then((res) => {
		    util.log(`Located: ${res}`);
		    resolve(res);
		})
		.catch((err) => resolve(err));
	});
    },

    findOneByID_UpdateDatabase : function(req) {
	return new Promise((resolve, reject) => {

	    var id = req.params.id;
	    if (!ObjectId.isValid(id)) {
		reject(makeErrno(ECINVAL,
				 `Invalid ID: ${id} Used To Update Mongo`));
	    }

	    var update = req.params.update;
	    cleanUpdate(this.model, update);  /* This Probably Needs Work You Are Mutating Update */
	    if (!update) {
		reject(makeErrno(ECINVAL,
				 `Invalid Update: ${update} Passed To Mongo`));
	    }
	    
	    this.model.findByIdAndUpdate(id, {$set : update}, {new : true})
		.then((res) => {
		    resolve(res);
		})
		.catch((err) => {
		    reject(err);
		});
	});
    }
}


for (var func in Interface) {
    Mongo.prototype[func] = Interface[func];
}

module.exports = {Mongo};
