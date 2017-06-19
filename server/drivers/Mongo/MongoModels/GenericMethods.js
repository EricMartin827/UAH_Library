

/* Import Node Core Modules */
const util = require("util");

/* Import and Set Up Custon Node Modules*/
const {NODE_ERRORS} = require("./../TOOLS");
const {ERRNO} = NODE_ERRORS;
const {CUSTOM_ERRNO} = NODE_ERRORS;
const {makeErrno} = NODE_ERRORS;
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
		.catch((err) => reject(err));
    	});
    },

    commitToDatabase : function() {
    	var instance = this;
    	return new Promise((resolve, reject) => {
	    instance.update()
		.then((res) => {
		    util.log(`Updated: ${this}`);
		    resolve(res);
		})
		.catch((err) => {
		    console.error(`Failed To Update: ${this} ` +
				  `--> ERROR: ${ERRNO[err.code]}`);
		    //console.log(err);
		    reject(err);
		});
    	})
    }
}


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

    findOneByID_QueryDatabase : function(id) {
	var model = this;
	return new Promise((resolve, reject) => {
	    if (!ObjectID.isValid(id)) {
		reject(makeErrno(ECINVAL,
				 `Invalid ID ${id} Used To Query Mongo`));
	    }
	    model.findById(id)
		.then((res) => {
		    util.log(`Located: ${res}`);
		    resolve(res);
		})
		.catch((err) => resolve(err));
	});
    },

    findOneByID_UpdateDatabase : function(id, update) {
	var model = this;
	return new Promise((resolve, reject) => {
	    
	    if (!ObjectID.isValid(id)) {
		reject(makeErrno(ECINVAL,
				 `Invalid ID ${id} Used To Update Mongo`));
	    }
	    
	    if (!update) {
		reject(makeErrno(ECINVAL,
				 `Undfined Update Used To Modify Mongo`));
	    }
	    
	    
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
						"Failed to Provide Update"));
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
    
