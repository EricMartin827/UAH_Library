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
const {LIBRARY} = require("./LIB");
const {NODE_LIB} = LIBRARY;
const {CUSTOM_LIB} = LIBRARY;

const {validator} = NODE_LIB;
const {jwt} = NODE_LIB;
const {bcrypt} = NODE_LIB;
const {_} = NODE_LIB;
const {Immutable} = NODE_LIB;
const {Schema} = NODE_LIB;
const {printObj} = CUSTOM_LIB;

/* Error Imports */
const {ERROR_LIB} = require("./LIB");
const {CUSTOM_ERRNO} = ERROR_LIB;
const {makeErrno} = ERROR_LIB;
const {EPERM} = CUSTOM_ERRNO;
const {NO_USER} = CUSTOM_ERRNO;
const {BAD_WEB_TOKEN} = CUSTOM_ERRNO;


/* Mongo Database Imports */
const {MongoDB} = require("./../MongoDatabase.js");


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
 * @attribute email a {String} specifying the user's email
 * @attribute passWord a {String} specifying the user's password
 * @attribute firstName a {String} specifying the user's first name
 * @attribute lastName a {String} specifying the user's last name
 * @attribute tokens an {Array} containing the user's web tokens
 * @attribute access a {String} indicating if user had admin privileges
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
    },

    tokens : [
	{
	    access : {
		type : String,
		enum : ["admin", "user", "newUser"],
		required : [true, "All Users Must Have Security Tokens"],
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

    access : {
	type: String,
	enum : ["admin", "user"],
	required : true,
	immutable : true
    },

}, {strict : true});
UserSchema.plugin(Immutable); /* Prevent Client From Changing Admin Status */

/* Alias the User Schema's instance and static methods for readibility */
var instanceMethods = UserSchema.methods;
var schemaMethods = UserSchema.statics;

/* Declare The Fields Client Browser Can View */
const publicAttributes = ["_id", "email", "firstName", "lastName"];

/******************************************************************************/
/**************************** Instance Methods ********************************/
/******************************************************************************/

/**
 * Instance method for the User Schema/Class. Returns a readable string
 * displaying the username of 'this' instance of user. The username is
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
 * Instance method for the User Schema/Class. Returns secure JSON data
 * to the requesting client. The JSON data returned will only contian
 * public attributes that do not compromise the security of the
 * database.
 *
 * @method toJSON
 * @return {JSON DATA} a safe JSON representation of the user instance
 */
instanceMethods.toJSON = function() {

    var userObject = this.toObject();
    return _.pick(userObject, publicAttributes);
}

/**
 * Instance method for the User Schema/Class. Iterates through
 * 'this' user's tokens and returns a registration token if
 * present. Otherwise, returns null.
 *
 * @method getRegistrationToken
 * @return {String} 'this' user's registration token
 */
instanceMethods.getRegisterToken = function() {

    var user = this;
    for (var ii = 0; ii < user.tokens.length; ii++) {
	if (user.tokens[ii].access === "newUser") {
	    return user.tokens[ii].token;
	}
    }
    return null;
}

/**
 * Instance method for the User Schema/Class. Generates a web token that
 * gives the client secure access to the admin, user, and registration
 * routes. The type of web token generated is dependent on the specified
 * access. Allowed access modes are "admin", "user", and "newUser". The
 * "newUser" access is used specifically for generating registration
 * tokens. Method returns a Promise to return the newly generated token.
 *
 * @method initAuthToken
 * @param access {Enum String} "admin", "user", "newUser"
 * @return {Promise} to return a new web token
 */
instanceMethods.initAuthToken = function(access) {

    var user = this;
    var token = jwt.sign({
	_id : user._id.toHexString(),
	access
    },"salt").toString();

    if (user.tokens.length) {
	for (var ii = 0; user.tokens.length; ii++) {
	    if (user.tokens[ii].access === access) {
		user.tokens[ii] = {access, token};
		break;
	    }
	}
    } else {
	user.tokens.push({access, token});
    }

    return user.save().then(() => {
	return token;
    });
}

/******************************************************************************/
/**************************** Static Methods **********************************/
/******************************************************************************/

/**
 * Static method for the User Schema/Class. Returns an array of the public
 * User attributes that the client can view. Used primarily in test suites
 * to confirm that the client's data is properly stored in the database by
 * the server.
 *
 * @method getAttributes
 * @return {Array} a collection of User properties the client can recieve
 *                 in the browser
 */
schemaMethods.getAttributes = function() {
    return publicAttributes;
}

/**
 * Static method for the User Schema/Class. Method decodes the client
 * supplied web token. Once the web token has been certified to not have
 * been altered, method queires the database for the user associated with the
 * token and the proper access credentials. This method is used by express
 * middleware to make critical server routes private and sequester user
 * routes from admin routes.
 *
 * @method findByToken
 * @param token the client's supplied web token
 * @param aceess {Enum String} "admin", "user", "newUser"
 * @return {Promise} to return the user associated with the specified token
 *                   and access rights
 */
schemaMethods.findByToken = function(token, access) {

    var User = this;
    var decoded;
    try {
	decoded = jwt.verify(token, "salt");
    } catch (err) {
	return Promise.reject(makeErrno(
	    BAD_WEB_TOKEN, `Client Provided an Invalid Web Token: ${token}`));
    }
    return User.findOne(
	{
	    "_id" : decoded._id,
	    "tokens.token" : token,
	    "tokens.access" :  access
	}
    );
}

/**
 * Static method for the User Schema/Class. Method queies the database for
 * a user with the specified email and access rights. If the query is
 * successful, then the user's stored database passowrd is decrypted and
 * compared with the client supplied password. If successful, the user is
 *returned to the server.
 *
 * @method findByCredential
 * @param email the client's supplied email
 * @param password the client's supplied password
 * @param aceess {Enum String} "admin", "user", "newUser"
 * @return {Promise} to return the user associated with the specified email
 *                   and password
 */
schemaMethods.findByCredentials = function (email, password, access) {

    var User = this;
    return User.findOne({email, access})
	.then((user) => {

	    if (!user) {
		return Promise.reject(makeErrno(
		    NO_USER,
		    `User: ${email} with access: ${access} not found`));
	    }

	    return new Promise((resolve, reject) =>  {
		bcrypt.compare(password, user.password, (err, res) => {
		    if (res) {
			return resolve(user);
		    }
		    reject(makeErrno(EPERM,
				     `Failed to validate password for ` +
				     `user: ${user.email}`));
		});
	    });
	})
}

/******************************************************************************/
/**************************** Mongoose Middelware *****************************/
/******************************************************************************/

/*
 * If the password field of a user document is modified before an attempt is
 * made to save the user into the database, then hash the newly updated password
 * and store the user's encrypted password into the database. Never store raw
 * plain text passwords in a database.
 */
UserSchema.pre("save", function(next) {

    var user = this;
    if (user.isModified("password")) {
	bcrypt.genSalt(10, (err, salt) => {
	    bcrypt.hash(user.password, salt, (err, hash) => {
		user.password = hash;
		next();
	    })
	});
    } else {
	next();
    }
});

/* Compile the Mongoose Schema into an active Mongoose "User" model and
 * export the model. No new database methods/functions can be added to the
 * User Class after this point.
 */
User = MongoDB.model("User", UserSchema);
module.exports = {User};
