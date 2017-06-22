const express = require("express");
const bodyParser = require("body-parser")

var app = express();
app.use(bodyParser.json());

function stringify(obj) {

    if (obj) {
	return JSON.stringify(obj, undefined, 2);
    }
}

function isFunc(val) {
    return typeof(val) === "function";
}

function isObject(val) {
    return typeof(val) === "object";
}

module.exports = {
    UTILS : {
	app: app,
	stringify: stringify,
	isObject: isObject,
	isFunc: isFunc,
    }
};
