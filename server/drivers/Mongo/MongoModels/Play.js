/**
 * Play.js defines the prototype for Play object which are stored as documents
 * in a MongoDB database.
 *
 * For playSchema, the combination of title and author is unique. This is set
 * up in the database, via InitMongo.js. NOT HERE!.
 * It is included in the schema merely for documentation purposes. Mongoose does
 * not ensure primary key integrity. This is accomplished via the InitMongo.js
 * file which is executed locally on the server before application deployment.
 *
* @author Eric William Martin
*/

const {MongoDB} = require("./../MongoDatabase.js");
const {Schema} = require("./../MongoDatabase.js");
const {ERRNO} = require("./../TOOLS");
const util = require("util");

const playSchema = new Schema({

    /* Unique Primary Keys */
    title: {
	type : String,
	required: true,
	minLength : 1,
	maxLencth : 100,
	trim : true
    },
    authorLast: {
	type : String,
	required: true,
	minLength: 1,
	maxLength: 50,
	trim: true
    },
    authorFirst: {
	type : String,
	required: true,
	minLength: 1,
	maxLength: 50,
	trim: true
    },

    /* Mutable Public Attributes */
    genre:         {type: String, default: "Drama"},
    timePeriod:    {type: String, default: "Not Specified"},
    hasSpectacle:  {type: Boolean, default: false},
    actorCount:    {type: Number, min: 1, max: 50, default: 10},
    costumeCount:  {type: Number, min: 1, max: 50, default: 10},
    copies:        {type: Number, min: 0, max: 50, default: 1}
 
});


/**
 * Instance methods for invidual Play objects.
 */
instanceMethods = {

    /*-----------------------------------*/
    /*--------Client Side Helpers--------*/
    /*-----------------------------------*/

    getAuthorFormal: function() {
	return `${this.authorLast}, ${this.authorFirst}`;
    },

    isAvailable: function() {
	return this.copies === 0;
    },

    toString: function() {
	return `Play "${this.title}" By: ${this.authorFirst} ` +
	    `${this.authorLast}`
    },

    /*-----------------------------------*/
    /*----------Databse Access-----------*/
    /*-----------------------------------*/


    findSynopsis: function() {
	return null;
    },

    updateSynopsis: function() {
	return null;
    },

    deleteSynopsis: function() {
	return null;
    },

    findComments: function() {
	return null;
    },

    addComment: function(newComment) {
	return null;
    },

    deleteComment: function(commentID) {
	return null;
    },

    flushComments: function() {
	return null;
    },

    
};

for (var func in instanceMethods) {
    playSchema.methods[func] = instanceMethods[func];
}

/* Compile the schema into a usable model and export the constructor.
 * Note that the instance models will have access to the generic static
 * methods added onto playSchema.statics.
 */
var Play = MongoDB.model("Play", playSchema);
module.exports = {Play};
