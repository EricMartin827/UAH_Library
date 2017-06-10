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

const Network = require("./MongoNetwork");
const Schema = Network.Schema;
var db = Network.Connection;


const playSchema = new Schema({

    /* Primary Keys */
    title: {
	type : String,
	unique: true, /* DOES NOT VALIDATE */
	minLength : 1,
	maxLencth : 100,
	trim : true
    },
    authorLast: {
	type : String,
	unique: true, /* DOES NOT VALIDATE */
	minLength: 1,
	maxLength: 50,
	trim: true
    },
    authorFirst: {
	type : String,
	unique: true, /* DOES NOT VALIDATE */
	minLength: 1,
	maxLength: 50,
	trim: true
    },

    /* Non-Key Attributes */
    genre:         {type: String, default: "Drama"},
    timePeriod:    {type: String, default: "Not Specified"},
    isSpectacle:   {type: Boolean, default: false},
    actorCount:    {type: Number, min: 1, max: 50, default: 10},
    costumeCount:  {type: Number, min: 1, max: 50, default: 10},
    copies:        {type: Number, default: 1}
});

/*
* Instance Method for Play Objects.
*/

playSchema.methods = {

    getTitle: function() {
	return this.title;
    },
    
    setTitle: function(newTitle) {

	if (!newTitle) {
	    console.warn("No Argument Passed to setTitle()");
	}
	this.title = newTitle || this.title;
	return this;
    },

    getAuthorLast: function() {
	return this.authorLast;
    },

    getAuthorFirst: function() {
	return this.authorFirst;
    },

    getAuthorFormal: function() {
	return `${this.authorLast}, ${this.authorFirst}`;
    },

    setAuthor: function(newLast, newFirst) {

	if (!newLast) {
	    console.warn("setAuthor(): No Update to Author Lastname");
	} else if (!newFirst) {
	    console.warn("setAuthor(): No Update to Author Firstname");
	}
	this.authorLast = newLast || this.authorLast;
	this.authorFirst = newFirst || this.authorFirst;
    },

    getGenre: function() {
	return this.genre;
    },

    setGenre: function(newGenre) {

	if (!newGenre) {
	    console.warn("No Argument Passed to setGenre()");
	}
	this.genre = newGenre || this.genre;
    },

    getTimePeriod: function() {
	return this.timePeriod;
    },

    setTimePeriod: function(newTimePeriod) {

	if (!newTimePeriod) {
	    console.warn("No Argument Passed to setTimePeriod()");
	}
	this.timePeriod = newTimePeriod || this.timePeriod;
    },

    hasSpectacle: function() {
	return this.isSpectacle;
    },

    getActorCount: function() {
	return this.actorCount;
    },

    getCostumeCount: function() {
	return this.costumeCount;
    },

    getCopies: function() {
	return this.copies;
    },
    
    isAvailable: function() {
	return this.copies === 0;
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
	return null
    }
}

var Play = db.model("Play", playSchema);

var test = new Play({
    title: "Romeo And Juliet",
    author:"William Shakespeare"
});

test.save().then(function(test) {
    console.log("Success");
}).catch(function(err) {
    console.error("Error: ", err);
});

console.log("My App Is Still Running!!!");










