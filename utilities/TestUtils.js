const expect = require("expect");
const {UTILS} = require("./AppUtils");

const {isFunc} = UTILS;
const {isObject} = UTILS;

function httpJSON_2_ObjArr(req, Constr) {

    if (arguments.length !== 2) {
    	return console.error("httpJSON2Instance requires 2 arguments");
    }

    if (!isObject(req) || !req.body || !Array.isArray(req.body)) {
	return console.error("HTTP Request Failed To Send Array of Objects");
    }

    if (!isFunc(Constr) || !Constr.schema || !Constr.schema.obj) {
	return console.error("Invalid Contructor: No Schema Object Present");
    }

    var arr = [];
    req.body.forEach((ele) => {
	for (var prop in ele) {
	    if (!Constr.schema.obj.hasOwnProperty(prop)) {
		var model_name = Constr.collection.collectionName;
		console.warn(`Request property ${prop} not in ${model_name}`);
		delete ele[prop];
	    }
	}
	arr.push(new Constr(ele));
    });
    return arr;
}

function verifyClientServer(clientData, serverDoc) {

    if (arguments.length !== 2) {
	return console.error("verifyClientServer requires client and server data, " +
		      "and a constructor");
    }

    if (Array.isArray(clientData) || !isObject(clientData)) {
	return console.error("Client Data Cannot Be An Array : Must Be an Object");
    }

    if (!isObject(serverDoc) || !serverDoc._id) {
	return console.error("Server Response Lacks Mongo Document ID");
    }

    var count = Object.keys(clientData).length;
    if (count < 1) {
	return console.error("Client Data Must Have Properties");
    }
 
    for (var prop in serverDoc) {
	if (clientData.hasOwnProperty(prop)) {
	    count--;
	    expect(clientData[prop]).toBe(serverDoc[prop]);
	}
    }

    if (count) {
	return console.error("Not All Client Properties Verified");
    }
    return true;
}

module.exports = {
    TEST_UTILS : {
	httpJSON_2_ObjArr : httpJSON_2_ObjArr,
	verifyClientServer : verifyClientServer
    }
}
