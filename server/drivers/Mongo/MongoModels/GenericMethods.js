

/* Import Node Core Modules */
const util = require("util");

/* Import and Set Up Custon Node Modules*/
const NODE_ERROR = require("./../TOOLS");
const {ERRNO} = NODE_ERROR;
const {CUSTOM_ERRNO} = NODE_ERROR;
const {makeErrno} = NODE_ERROR;
const {FAILED_UPDATE} =  CUSTOM_ERRNO;
const {NO_CLIENT_REQUEST} = CUSTOM_ERRNO;

var instanceInterface = {

    addToDatabase : function() {
	var instance = this;
	return new Promise((resolve, reject) => {
	    instance.save()
		.then((res) => {
		    util.log(`Saved: ${this}`);
		    resolve(res);
		})
		.catch((err) => {
		    console.error(`Failed To Save: ${this} ` +
				  `--> ERROR: ${ERRNO[err.code]}`);
		    reject(err);
		});
    	});
    }
}


/* Bind These in Each MongoModel Class */
var classInterface = {
    
    findOneFromDatabase : function(query) {
	var model = this;
	return new Promise((resolve, reject) => {
	    model.findOne(query).exec()
		.then((res) => {
		    util.log(`Located: ${res}`);
		    resolve(res);
		})
		.catch((err) => {
		    query = query || "No Query Specified";
		    console.error(`Failed To Locate: ${query} --> ERROR: ` +
				  `${err.code}`);
		    console.log(err);
		    reject(err);
		});
	});
    },

    findAllFromDatabase: function(query) {
	var model = this;
	return new Promise((resolve, reject) => {
	    model.find(query).exec()
		.then((res) => {
		    util.log(`Located ${res.length}: ${query}`);
		    resolve(res);
		})
		.catch((err) => {
		    console.error(`Failed To Locate: ${query} --> ERROR: ` +
				  `${err.code}`);
		    resolve(err);
		})
	});
    },

    findOneModifyDatabase: function(query, update) {
	var model = this;
	return new Promise((resolve, reject) => {
	    model.findOneAndUpdate(query, update, {new : true})
		.exec().then((res) => {
		    if (!res) {
			return reject(makeErrno(FAILED_UPDATE,
					 `Query=${query} Failed to Provide ` +
					 `Update=${update}`));
		    }
		    util.log(`Located ${query} : New Document: ${res}`);
		    resolve(res);
		})
		.catch((err) => {
		    console.error(`Failed To Update From ${query} --> ERROR: ` +
				  `${err.code}`);
		    reject(err);
		});
	});
    },

    findManyModifyDatabase: function(query, update) {
	this.findOneAndUpdate(query, update, {new : true})
	    .exec().then((res) => {
		util.log(`Located ${query} : New Document: ${res[0]}`);
		resolve(res);
	    })
	    .catch((err) => {
		console.error(`Failed To Update From ${query} --> ERROR: ` +
			      `${err.code}`);
		reject(err);
	    });
    }
}


module.exports = {
    classInterface : classInterface,
    instanceInterface : instanceInterface
}
    
