/**
 * Play.js is a module which defines the prototype for a Play Collections stored
 * in a MongoDB database.
 *
 * All Play Models must have a unique combination of titles and primary authors.
 * The unique key property is set up by the InitMongo.js module located in the
 * servers environment. The unique key property is enforced by the database. It
 * is not enforced by this module nor the Mongoose Library.
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
const {Immutable} = require("./../MongoDatabase.js");

/**
 * A Mongoose Model that defines the major properties of a Play Collection
 * and invokes the final system calls which access the database for Play
 * documents.
 *
 * @class Play
 * @constructor
 */
var Play; /* This defined at the bottom due to Mongoose API .model() */

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
 * @attribute actorCount a {Number} specifying the amount of actors needed
 * @attribute costumeCount a {Number} specifying the amount of costumes needed
 * @attribute copies a {Number} specifying the amount of available copies
 *
 */
const PlaySchema = new Schema({

    /* Immutable Unique Primary Keys */
    title: {
	type : String,
	required: true,
	minLength : 1,
	maxLencth : 100,
	trim : true,
	immutable : true
    },
    authorLast: {
	type : String,
	required: true,
	minLength: 1,
	maxLength: 50,
	trim: true,
	immutable : true
    },
    authorFirst: {
	type : String,
	required: true,
	minLength: 1,
	maxLength: 50,
	trim: true,
	immutable : true
    },

    /* Public Attributes */
    genre:         {type: String, default: "Drama"},
    timePeriod:    {type: String, default: "Not Specified"},
    hasSpectacle:  {type: Boolean, default: false},
    actorCount:    {type: Number, min: 1, max: 50, default: 10},
    costumeCount:  {type: Number, min: 1, max: 50, default: 10},
    copies:        {type: Number, min: 0, max: 50, default: 1}

}, {strict : true}); /* Prevents client from adding new attributes */

PlaySchema.plugin(Immutable);

/*  Instance methods for invidual Play objects. */
var instanceMethods = {

    /*-----------------------------------*/
    /*--------Client Side Helpers--------*/
    /*-----------------------------------*/

    getAuthorFormal: function() {
	return `${this.authorLast}, ${this.authorFirst}`;
    },

    toString: function() {
	return `Play "${this.title}" By: ${this.authorFirst} ` +
	    `${this.authorLast}`
    }
};

for (var func in instanceMethods) {
    PlaySchema.methods[func] = instanceMethods[func];
}

/* Compile the Mongoose Schema into an active Mongoose "Play" model and
 * export the model. No new database methods/functions can be added to the
 * Play Class after this point.
 */
Play = MongoDB.model("Play", PlaySchema);
module.exports = {Play};
