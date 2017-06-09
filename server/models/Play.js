const Network = require("./MongoNetwork");
const Schema = Network.Schema;
var db = Network.Connection;

const playSchema = new Schema({
    title: {
	type : String,
	unique: true,
	minLength : 1,
	maxLencth : 100,
	trim : true
    },
    author: {
	
    genre:         String,
    timePeriod:    String,
    isSpectacle:   Boolean,
    actorCount:    {type: Number, min: 1, max: 50},
    costumeCount:  {type: Number, min: 1, max: 50},
    lastUpdated:   {type: Date, default: Date.now}
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

    getAuthor: function() {
	return this.author;
    },

    setAuthor: function(newAuthor) {

	if (!newAuthor) {
	    console.warn("No Argument Passed to setAuthor()");
	}
	this.author = newAuthor || this.author;
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










