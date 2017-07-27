/**
 * CheckOut.js is a submodule which defines the prototype for a CheckOut
 * Collection stored in a MongoDB database.
 *
 * All CheckOut Models contain references to a play id and a user id to
 * represent the state of an individual user checking out an individual play.
 * The implications of this design are that both Plays and Users store no
 * information about which user checked out which play. This allows the client
 * to modify the Checkout Collection [a user returning a play or taking a play]
 * without needing to make any modifications to the User or Play Collections.
 * Checkout Models also store their creation date which allows the client to
 * determine if a particular play is overdue.
 *
 * @submodule CheckOut.js
 * @author Eric William Martin
 */
"use strict"

const {NODE_LIB} = require("./LIB");
const {Schema} = NODE_LIB;
const {Immutable} = NODE_LIB;

/* Error Improts */
const {ERROR_LIB} = require("./LIB");

/* Mongo Database Imports */
const {MongoDB} = require("./../MongoDatabase.js");

/* Mongo Collection Imports */
const {User} = require("./User.js");
const {Play} = require("./Play.js");

/**
 * CheckOut is A Mongoose Model that defines the major properties of the
 * CheckOut Collection and invokes the final system calls which access the
 * database for CheckOut documents.
 *
 * @class CheckOut
 * @constructor
 */
var CheckOut; /* This defined at the bottom due to Mongoose API */

/**
 * CheckOutSchema defines the properties of a CheckOut Collection stored in
 * a MongoDB database.
 *
 * @element CheckOutSchema
 * @attribute playID the play that is being checkout
 * @attribute userID the user that is renting the play
 * @attribute date the date at which the play was checked out
 */
const CheckOutSchema = new Schema({

    /* Unique Primary Keys */
    playID : {
	type : Schema.Types.ObjectId,
	required : true
    },
    
    userID : {
	type : Schema.Types.ObjectId,
	required : true
    },

    /* Public Attribute */
    date  : {
	type : Date,
	default : Date.now,
	immutable : true
    }
    
}, {strict : true});


/*
 * In order for a user to successfully check out a play, the server must
 * first validate that the user and the play are both present in the database.
 * The server must also validate that the current number of checkouts for the
 * target play does not exceed the number of copies available.
 *
 * The code below makes use of Mongoose Middleware to accomplsih the necessary
 * validation. Due to the modular design of each schema/collection, the queires
 * necessary to perform validation can be performed in parallel. The
 * parallelism is triggerd by passing 'true' as the second argument to each
 * middleware hook.
 */

CheckOutSchema.pre("validate", true, (done) => {
    
});


CheckOutSchema.plugin(Immutable);
