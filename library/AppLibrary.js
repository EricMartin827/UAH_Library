const express    = require("express");
const validator  = require("validator");
const bodyParser = require("body-parser")
const util       = require("util");
const mongoose   = require("mongoose");
const Immutable  = require("mongoose-immutable");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
const qString    = require("query-string");
const _          = require("lodash");


const {ObjectId} = require("mongoose").Types;

function stringify(obj) {

    if (obj) {
	return JSON.stringify(obj, undefined, 2);
    }
}

function isJSONstring(str) {

    try {
	JSON.parse(str);
    } catch (err) {
	return false;
    }
    return true;
}

/*
 * Potential Security Violation If the User sends a dick string. Consider
 * using a wapper to count the nestings.
 */
function toObject(str) {
    var val = str;
    if (isJSONstring(str)) {
	val = JSON.parse(str);
	for (var prop in val) {
	    val[prop] = toObject(val[prop]);
	}
    }
    return val;
}

function toJSON(val) {
    if (isObject(val)) {
	for (var prop in val) {
	    val[prop] = toJSON(val[prop])
	}
	return JSON.stringify(val);
    }
    return val
}

function toQuery(obj) {
    if (isObject(obj)) {
	for (var prop in obj) {
	    obj[prop] = toJSON(obj[prop])
	}
	return qString.stringify(obj);
    }
}

function printObj(obj) {
    console.log(stringify(obj));
}

function isFunc(val) {
    return val.constructor === Function;
}

function isString(val) {
    return val.constructor === String;
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

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function isNotDefined(val) {
    return !val || (val === "null") || (val === "undefined");
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
	    qString         : qString,
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
	    nextChar        : nextChar,
	    stringify       : stringify,
	    printObj        : printObj,
	    toObject        : toObject,
	    toQuery         : toQuery,
	    isNotDefined    : isNotDefined
	}
    }
};
