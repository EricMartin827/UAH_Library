/* Import and Set Up Custon Node Modules*/
const util = require("util");
const {NODE_ERRORS} = require("./TOOLS");
const {UTILS} = require("./TOOLS");
const {isFunc} = UTILS;
const {ERRNO} = NODE_ERRORS;
const {CUSTOM_ERRNO} = NODE_ERRORS;
const {ECINVAL} = CUSTOM_ERRNO;
const {ESINVAL} = CUSTOM_ERRNO;
const {makeErrno} = NODE_ERRORS;
const {FAILED_UPDATE} =  CUSTOM_ERRNO;
const {NO_CLIENT_REQUEST} = CUSTOM_ERRNO;
const {ObjectId} = require("mongoose").Types;
const {isObject} = UTILS;

function strip(Model, object) {

    delete object["_id"];
    delete object["__v"];
    for (var prop in object) {
	if (!Model.schema.obj.hasOwnProperty(prop)) {
	    var model_name = Model.collection.collectionName;
	    console.warn(`Property ${prop} not in ${model_name}`);
	    delete object[prop];
	}
    }
}

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

function Mongo(Model) {

    if (!(Model && isFunc(Model) && Model.schema && Model.schema.obj)) {
	throw makeErrno(ESINVAL, "Invalid Model: No Schema Object Present");
    }
    this.model = Model;
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
	    if (!id || !ObjectId.isValid(id)) {
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
	    if (!ObjectId.isValid(id)) {
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

    /********************************************/
    /******* Multiple Document Interface ********/
    /********************************************/

    addMultipleDocuments_ModifyDatabase : async function(req) {

	var docs = initMultDocs(this.model, req.body);
	for (let ii = 0; ii < docs.length; ii++) {
//	    console.log(ii + " = "  + docs[]);
	    docs[ii] = await docs[ii].save(); 
	}
	return docs;
	// return new Promise((resolve, reject) => {
	    
	//     try {
	// 	var docs = initMultDocs(this.model, req.body);
	// 	for (let ii = 0; ii < docs.length; ii++) {
	// 	    var entry = docs[ii];
	// 	    docs[ii] = await entry.save();
	// 	}
	//     } catch (err) {
	// 	reject(err);
	//     }
	//     resolve(docs);
	// });
    }
}


for (var func in Interface) {
    Mongo.prototype[func] = Interface[func];
}

module.exports = {Mongo};

