const {ERRNO} = require("./../TOOLS");
const util = require("utils");

var instanceInterface = {

    addToDatabase : function() {
	var instance = this;
	return new Promise((resolve, reject) => {
	    instance.save()
		.then((res) => {
		    util.log(`Saved: ${this.toString()}`);
		    resolve(res);
		})
		.catch((err) => {
		    util.error(`Failed To Save: ${instance.toString()} ` +
			       `--> ERROR: ${ERRNO[err.code]}`);
		    reject(err);
		});
    	});
    },

    saveToDatabase : function() {
	var instance = this;
	return new Promise((resolve, reject) => {
	    instance.update()
		.then((res) => {
		    util.log(`Updated: ${instance.toString()}`);
		    resolve(res);
		})
		.catch((err) => {
		    util.log(`Failed To Update: ${instance.toString()} ` +
			     `--> ERROR: ERRNO[err.code]`);
		    reject(err);
		});
	});
    }    
}


/* Bind These in Each MongoModel Class */
var classInterface = {

    findOneFromDatabase : function(query) {
	return new Promise((resolve, reject) => {
	    this.findOne(query).exec()
		.then((res) => {
		    util.log(`Located: ${query}`);
		    resolve(res);
		})
		.catch(err) => {
		    util.log(`Failed To Locate: ${query} --> ERROR: ` +
			     `${err.code}`);
		    reject(err);
		}
	});
    },

    findAllFromDatabase: function(query) {
	return new Promise((resolve, reject) => {
	    this.find(query).exec()
		.then((res) => {
		    util.log(`Located ${res.length}: ${query}`);
		    resolve(res);
		})
		.catch((err) => {
		    util.error(`Failed To Locate: ${query} --> ERROR: ` +
			     `${err.code}`);
		    resolve(err);
		})
	});
    },

    findOneModifyDatabase: function(query) {
	return new Promise((resolve, reject) => {
	    this.findOneAndUpdate(query, update, {new : true})
		.exec().then((res) => {
		    util.log(`Located ${query} : New Document: ${res[0]}`);
		    resolve(res);
		})
		.catch((err) => {
		    util.error(`Failed To Update From ${query} --> ERROR: ` +
			       `${err.code}`);
		    reject(err);
		});
	});
    },

    findManyModifyDatabase: function(query) {
	this.findOneAndUpdate(query, update, {new : true})
	    .exec().then((res) => {
		util.log(`Located ${query} : New Document: ${res[0]}`);
		resolve(res);
	    })
	    .catch((err) => {
		util.error(`Failed To Update From ${query} --> ERROR: ` +
			   `${err.code}`);
		reject(err);
	    });
    }
}


module.exports = {
    classInterface : classInterface,
    instanceInterface : instanceInterface
}
    
