const express = require("express");
const bodyParser = require("body-parser")
const {ObjectId} = require("mongoose").Types;

var app = express();
app.use(bodyParser.json());

function stringify(obj) {

    if (obj) {
	return JSON.stringify(obj, undefined, 2);
    }
}

function isFunc(val) {
    return val.constructor === Function;
}

function isObject(val) {
    return val.constructor === Object;
}

function isEmptyObject(val) {
    return val.constructor === Object && Object.keys(val).length === 0;
}

function isValidID(id) {
    return ObjectId.isValid(id);
}

module.exports = {
    UTILS : {
	app: app,
	stringify: stringify,
	isObject: isObject,
	isFunc: isFunc,
	isEmptyObject : isEmptyObject,
	isValidID: isValidID
    }
};
