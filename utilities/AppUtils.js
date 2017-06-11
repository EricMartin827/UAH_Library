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

function httpJSON2Instance(req, Constr) {

    if (arguments.length !== 2) {
    	return console.error("httpJSON2Instance requires 2 arguments");
    }

    if (!isObject(req) || !req.body) {
	return console.error("HTTP JSON Request Has No Body");
    }

    if (!isFunc(Constr) || !Constr.schema || !Constr.schema.obj) {
	return console.error("Invalid Contructor: No Schema Object Present");
    }

    var arg = {};
    for (var prop in req.body) {
	if (Constr.schema.obj.hasOwnProperty(prop)) {
	    arg[prop] = req.body[prop];
	} else {
	    var model_name = Constr.collection.collectionName;
	    console.warn(`JSON request property ${prop} not in ${model_name}`);
	}
    }
    return new Constr(arg);
}

module.exports = {
    UTILS : {
	app: app,
	printObj: printObj,
	isObject: isObject,
	isFunc: isFunc,
	httpJSON2Instance: httpJSON2Instance
    }
};
