const express    = require("express");
const validator  = require("validator");
const bodyParser = require("body-parser")
const util       = require("util");
const mongoose   = require("mongoose");
const Immutable  = require("mongoose-immutable");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
const _          = require("lodash");


const {ObjectId} = require("mongoose").Types;

function stringify(obj) {

    if (obj) {
	return JSON.stringify(obj, undefined, 2);
    }
}

function isFunc(val) {
    return val.constructor === Function;
}

function isNumber(val) {
    return val.constructor === Number;
}

function isArray(val) {
    return val.constructor === Array;
}

function isObject(val) {
    return val.constructor === Object;
}

function isEmptyObject(val) {
    return val.constructor === Object && Object.keys(val).length === 0;
}

function isValidID(val) {
    return ObjectId.isValid(id);
}

function isSchema(val) {
    return val && val.schema && val.schema.obj && isFunc(val);
}

module.exports = {

    LIBRARY : {
	
	NODE_LIB : {
	    bcrypt          : bcrypt,
	    bodyParser      : bodyParser,
	    express         : express,
	    Immutable       : Immutable,
	    jwt             : jwt,
	    mongoose        : mongoose,
	    Schema          : mongoose.Schema,
	    util            : util,
	    validator       : validator,
	    _               : _
	},
 
	CUSTOM_LIB : {
	    isArray         : isArray,
	    isEmptyObject   : isEmptyObject,
	    isFunc          : isFunc,
	    isNumber        : isNumber,
	    isObject        : isObject,
	    isSchema        : isSchema,
	    isValidID       : isValidID,
	    stringify       : stringify,
	}
    }
};
