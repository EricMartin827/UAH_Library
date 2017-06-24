/**
 * Play.js is a module which defines the prototype for Play Collections stored
 * in a MongoDB database.
 *
 * All Play models must have a unique combination of titles and primary authors.
 * The unique keys property is set up by the InitMongo.js module located in the
 * servers environment. The unique key property is enforced by the database. It
 * is not enforced by this module.
 *
 * @module Play.js
 * @author Eric William Martin
*/
"use strict"

/* Error Imports */
const {ERRNO} = require("./../TOOLS");

/* Monog Database Imports */
const {MongoDB} = require("./../MongoDatabase.js");
const {Schema} = require("./../MongoDatabase.js");


/**
 * PlaySchema defines the properties of a Play Collecttion stored in a MongoDB
 * database.
 * The Spectacle property indicates that the desired play has either an ornate
 * costume or an elaborate fight seen which the students must be aware of before
 * attempting to produce the play.
 *
 * @element PlaySchema the Schema for a Play Collection
 * @attribute title a {String} specifying the title of the Play
 * @attribute authorLast a {String} specifying the author's last name
 * @attribute authorFirst a {String} specifying the author's first name
 * @attribute hasSpectacle a {Boolean} signifing if the play has specatacle
 * @attribute genre a {String} specifying the Play's genre
 * @attibute timePeriod a {String} specifying the Play's historical setting
 * @attribute actorCount a {Number} specifying the needed actors for production
 * @attribute costumeCount a {Number} specifying the needed costume for production
 * @attribute copies a {Number} specifying the amount of available copies
 * 
 */
const PlaySchema = new Schema({

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

}, {strict : true}); /* Prevents client from adding new attributes */


/**
 * Instance methods for invidual Play objects.
 */
var instanceMethods = {

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
    PlaySchema.methods[func] = instanceMethods[func];
}

/* Compile the schema into a usable model and export the constructor.
 * Note that the instance models will have access to the generic static
 * methods added onto playSchema.statics.
 */
var Play = MongoDB.model("Play", PlaySchema);
module.exports = {Play};
