/**
* Play.js defines the prototype for Play object which are stored as documents
* in a MongoDB database.
*
* For playSchema the combination of title and author is unique. This is set
* up in the database, NOT HERE!. The unique tag in mongoose is NOT a validator!
* It is included in the schema merely for documentation purposes. Mongoose does
* not ensure primary key integrity. This is accomplished via the InitMongo.js
* file which is executed locally on the server before application deployment.
*
* @author Eric William Martin
*/

const {MongoDB} = require("./../MongoDatabase.js");
const {Schema} = require("./../MongoDatabase.js");
const {ERRNO} = require("./../TOOLS");
const {genericMethods} = require("./GenericMethods.js");

const playSchema = new Schema({

    /* Primary Keys */
    title: {
	type : String,
	required: true,
	unique: true, /* DOES NOT VALIDATE */
	minLength : 1,
	maxLencth : 100,
	trim : true
    },
    authorLast: {
	type : String,
	required: true,
	unique: true, /* DOES NOT VALIDATE */
	minLength: 1,
	maxLength: 50,
	trim: true
    },
    authorFirst: {
	type : String,
	required: true,
	unique: true, /* DOES NOT VALIDATE */
	minLength: 1,
	maxLength: 50,
	trim: true
    },

    /* Non-Key Attributes */
    genre:         {type: String, default: "Drama"},
    timePeriod:    {type: String, default: "Not Specified"},
    hasSpectacle:  {type: Boolean, default: false},
    actorCount:    {type: Number, min: 1, max: 50, default: 10},
    costumeCount:  {type: Number, min: 1, max: 50, default: 10},
    copies:        {type: Number, default: 1}
});

/**
 * Static methods for Play Model.
 */
modelMethods = {

    listAllPlays: function(upperLim) {

	Play.find({}).sort({authorLast: -1}).limit(upperLim)
	    .then((plays) => {
		console.log("All plays: ", plays);
		return plays;
	    }).catch((err) => {
		console.error("Failed to locate plays: ", err);
	    });
    }
};

/* Add the functions to playSchema for easy access in client */
for (var prop in modelMethods) {
    playSchema.statics[prop] = modelMethods[prop]
}


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

    /*-----------------------------------*/
    /*----------Databse Access-----------*/
    /*-----------------------------------*/


    saveInDatabase: function() {
	Play.update(this)
	    .then((dbRes) => {
		console.log("Updated Play: ", dbRes.body.title);
	    })
	    .catch((err) => {
		console.error("Failed to Update Play: " + this.title + " " +
			     ", ERROR: <Not Specified Yet :) >");
	    });
	
    },


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
    }
};

/* Add the functions to playSchema for easy access in client */
for (var prop in instanceMethods) {
    playSchema.methods[prop] = instanceMethods[prop];
}


/* Add the generic methods instance methods to playSchema */
for (var prop in genericMethods) {
    playSchema.methods[prop] = genericMethods[prop];
}


/* Compile the schema into a usable model and export the constructor.
 * Note that the instance models will have access to the generic static
 * methods added onto playSchema.statics.
 */
var Play = MongoDB.model("Play", playSchema);
module.exports = {Play};
