const express = require("express");
const bodyParser = require("body-parser")

var app = express();
app.use(bodyParser.json());

function printObj(obj) {

    if (obj) {
	console.log(JSON.stringify(obj, undefined, 2));
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
	printObj: printObj,
	isObject: isObject,
	isFunc: isFunc,
    }
};
