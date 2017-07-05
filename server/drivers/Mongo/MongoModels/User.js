/**
 * User.js is a module which defines the prototype for a User Collection stored
 * in a MongoDB database.
 *
 * All User Models must have a unique combination of username and password.
 * The unique key property is set up by the InitMongo.js module located in the
 * servers environment. The unique key property is enforced by the database. It
 * is not enforced by this module and the Mongoose Library.
 *
 * @submodule User.js
 * @author Eric William Martin
 */
"use strict"

/* Utility Imports */
const {UTILS} = require("./../TOOLS");
const {validator} = UTILS;
const {jwt} = UTILS;
const {_} = UTILS;

/* Error Imports */
const {ERRNO} = require("./../TOOLS");

/* Mongo Database Imports */
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
var User; /* This defined at the bottom due to Mongoose API */

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

    email : {
	type : String,
	required : [true, "Email is Required"],
	unique : [true, "Email is Already Taken"],
	minLength : [1, "Email Contains Too Few Characters"],
	maxLength : [50, "Email Cannot Exceed 50 Characters"],
	trim : true,
	validate : {
	    validator : (value) => {
		return validator.isEmail(value);
	    },
	    message : `{VALUE} Is Not A Valid Email`
	}
    },

    password : {
	type : String,
	required : [true, "All Users Must Have A Password"],
	minLength : [6, "Password Must Have At Least 6 Characters"],
	maxLength : 100,
	trim : true
	//select : false -> prevents password from being sent back
    },

    tokens : [
	{
	    access : {
		type : String,
		required : [true, "All Users Must Have Security Access Tokens"],
	    },
	    token : {
		type : String,
		required : [true, "All Users Must Have Security Tokens"]
	    }
	}
    ],

    /* Public Attributes */
    firstName : {
	type : String,
	required : [true, "All Users Must Supply A First Name"],
	minLength : 1,
	maxLength : 100,
	trim: true
    },

    lastName : {
	type : String,
	required : [true, "All Users Must Have a Last Name"],
	minLength : 1,
	maxLength : 100,
	trim: true
    },

    isAdmin : {type: Boolean, default: false, immutable : true},

}, {strict : true});

/* Make It Impossible For Clients to Change Admin Properties */
UserSchema.plugin(Immutable);



/* Instance methods for invidual Play objects. */
var instanceMethods = UserSchema.methods;

/**
 * Instance method for the User Schema/Class. Returns a readable string
 * displaying the username of this instance of user. The username is
 * simply the prefix of the user's email. Primarily used for loging user
 * use on the server.
 *
 * @method toString 
 * @return {Stirng} a simple string representation of this user
 */
instanceMethods.toString = function() {
    return `User: "${this.email.substr(0, this.email.indexOf("@"))}"`;
}

/**
 * Instance method for the User Schema/Class. Returns a an array containing
 * the user attributes that the server returns as JSON data to the requesting
 * client. Primaily used by TestUtils.js to test/validate server behavior.
 *
 * @method getAttributes
 * @return {Array} an array of user client attributes
 */
instanceMethods.getAttributes = function() {
    return ["_id", "email", "firstName", "lastName", "isAdmin"];
}

/**
 * Instance method for the User Schema/Class. Returns a secure JSON data
 * to the requesting client. The JSON data returned will not include passwords,
 * tokens, or any other user attribute that the client does not need.
 *
 * @method toJSON
 * @return a safe JSON representation of the user instance
 */
instanceMethods.toJSON = function() {
    var userObject = this.toObject();
    return _.pick(userObject, this.getAttributes());
}


instanceMethods.generateAuthTokens = function() {

    var user = this;
    var access = "auth";
    var token = jwt.sign({_id : user._id.toHexString(), access}, "secret").toSting();
    user.tokens.push({access, token});

    return user.save().then(() => {
	return token;
    });
}

/* Middleware Functions */

UserSchema.post("save", (user) => {
    console.log("User is ", user);
    return user;
})


/* Compile the Mongoose Schema into an active Mongoose "User" model and
 * export the model. No new database methods/functions can be added to the
 * User Class after this point.
 */
User = MongoDB.model("User", UserSchema);
module.exports = {User};
