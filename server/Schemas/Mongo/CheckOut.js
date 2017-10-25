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
const {NODE_LIB}       = require("./../library");
const {Schema}         = NODE_LIB;
const {Immutable}      = NODE_LIB;

/* Error Improts */
const {ERROR_LIB}      = require("./../library");
const {CUSTOM_ERRNO}   = ERROR_LIB;
const {makeErrno}      = ERROR_LIB;
const {ENO_PLAY}       = CUSTOM_ERRNO;
const {ENOT_AVAILABLE} = CUSTOM_ERRNO;

/* Mongo Database Imports */
const {MongoDB}        = require("./MongoDatabase.js");

/* Mongo Collection Imports */
const {Play}           = require("./Play.js");
const {User}           = require("./User.js");

/**
 * CheckOut is A Mongoose Model that defines the major properties of the
 * CheckOut Collection and invokes the final system calls which access the
 * database for CheckOut documents.
 *
 * @class CheckOut
 * @constructor
 */
var CheckOut; /* Forward delcaration. Defined at bottom due to Mongoose API */

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
CheckOutSchema.plugin(Immutable); /* Prevent Client From Changing Date */

/* Alias CheckOut Schema's instance and static methods for readibility */
var instanceMethods = CheckOutSchema.methods;
var schemaMethods = CheckOutSchema.statics;

/******************************************************************************/
/**************************** Static Methods **********************************/
/******************************************************************************/

schemaMethods.findNumberOfPlays = function(playID) {

    return CheckOut.find({"playID" : playID}).then((res) => {
	return res.length;
    });
}

schemaMethods.userHasPlay = function(userID, playID) {
    return CheckOut.find(
	{
	    "userID" : userID,
	    "playID" : playID
	}).then((resArray) =>  {
	    return (resArray.length === 0) ? false : true;
	})
}

schemaMethods.removeCheckOut = function(docID, userID) {

    return CheckOut.find(
	{
	    "_id" : docID,
	    "userID" : userID
	}).then((checkOut) => {
	if (!checkOut) {
	    return Promise.reject(makeErrno(
		NO_USER,
		`UserID: ${userID} is not renting play`
	    ));
	} else {
	    return CheckOut.findByIdAndRemove(docID).then((res) => {
		return res;
	    });
	}
	})
}

/******************************************************************************/
/**************************** Mongoose Middelware *****************************/
/******************************************************************************/

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

/*
 * Verify the play exists and the number of play copies is greater than the
 * number of checkouts associated with the target play.
 */
CheckOutSchema.pre("validate", true, function(next, done) {

    var checkOut = this;
    Play.findById(checkOut.playID).then((play) => {

	if (!play) {
	    done(new Error("Failed to locate play"));
	} else  {
	    CheckOut.findNumberOfPlays(checkOut.playID).then((count) => {

		if (play.copies <= count) {
		    done(new Error(`Play ${play.title} is not available`));
		} else {
		    done();
		}
	    }).catch((err) => done(err));
	}
    });

    next();
});

/* Verify the user exist */
CheckOutSchema.pre("validate", function(next) {

    var checkOut = this;
    User.findOne({"_id" : checkOut.userID})
	.then((user) =>  {

	    if (!user) {
		next(new Error(`User ${id} is not presnt`));
	    } else {

		CheckOut.userHasPlay(user._id, checkOut.playID)
		    .then((res) => {
			if (res) {
			    next(new Error("User already has play"))
			} else {
			    next();
			}
		    })
	    }
	}).catch((err) => next(err));
});

CheckOut = MongoDB.model("CheckOut", CheckOutSchema);
module.exports = {
    CheckOut : CheckOut
}
