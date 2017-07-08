const express    = require("express");
const validator  = require("validator");
const bodyParser = require("body-parser")
const {ObjectId} = require("mongoose").Types;

const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
const _          = require("lodash");

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
    UTILS : {
	express         : express,
	bodyParser      : bodyParser,
	validator       : validator,
	jwt             : jwt,
	bcrypt          : bcrypt,
	_               : _,
	stringify       : stringify,
	isNumber        : isNumber,
	isArray         : isArray,
	isObject        : isObject,
	isFunc          : isFunc,
	isEmptyObject   : isEmptyObject,
	isValidID       : isValidID,
	isSchema        : isSchema
    }
};
