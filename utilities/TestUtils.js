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

    if (!isObject(clientData)) {
	return console.error("clientData is not an object");
    }

    if (!isObject(serverDoc) && !serverDoc._id) {
	return console.error("serverData is not a document");
    }
    
    for (var prop in serverDoc) {
	if (clientData.hasOwnProperty(prop)) {
	    expect(clientData[prop]).toBe(serverDoc[prop]);
	}
    }
    return "VERIFIED";
}

module.exports = {
    TEST_UTILS : {
	httpJSON_2_ObjArr : httpJSON_2_ObjArr,
	verifyClientServer : verifyClientServer
    }
}



















