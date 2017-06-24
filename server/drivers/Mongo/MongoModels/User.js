/**
 * User.js is a module which defines the prototype for a User Collection stored
 * in a MongoDB database.
 *
 * All User Models must have a unique combination of username and password.
 * The unique key property is set up by the InitMongo.js module located in the
 * servers environment. The unique key property is enforced by the database. It
 * is not enforced by this module and the Mongoose Library.
 *
 * @module User.js
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
 * A Mongoose Model that defines the major properties of the User Collection
 * and invokes the final system calls which access the database for User
 * documents.
 *
 * @class User
 * @constructor
 */
var User;

/**
 * UserSchema defines the properties of a User Collecttion stored in a MongoDB
 * database.
 *
 * @element UserSchema the Schema for a User Collection
 * @attribute userName a {String} specifying the user's username
 * @attribute passWord a {String} specifying the user's password
 * @attribute firstName a {String} specifying the user's first name
 * @attribute lastName a {String} specifying the user's last name
 * @attribute isAdmin a {Boolean} indicating if user had admin privileges
 * @attribute oldPlays an {Array} of previous play _ids the user cheked out
 * @attibute curPlays an {Array}  of current play _ids the user checked out
 *
 */
const UserSchema = new Schema({

    /* Unique Primary Keys */
    userName : {
	type : String,
	required : true,
	minLength : 1,
	maxLength : 100,
	trim : true
    },

    passWord : {
	type : String,
	required : true,
	minLength : 1,
	maxLength : 100,
	trim : true
    },

    /* Public Attributes */
    firstName : {
	type : String,
	required : true,
	minLength : 1,
	maxLength : 100,
	trim: true
    },

    lastName : {
	type : String,
	required : true,
	minLength : 1,
	maxLength : 100,
	trim: true
    },

    isAdmin : {type: Boolean, default: false, immutable : true},

    oldPlays : [{type : Schema.Types.ObjectId, ref : "Play"}],
    curPlays : [{type : Schema.Types.ObjectId, ref : "Play"}]

}, {strict : true});

/* Compile the Mongoose Schema into an active Mongoose "User" model and
 * export the model. No new database methods/functions can be added to the
 * User Class after this point.
 */
User = MongDB.model("User", UserSchema);
module.exports = {User};
