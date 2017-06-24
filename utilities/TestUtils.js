const expect = require("expect");
const {UTILS} = require("./AppUtils");
const {isFunc} = UTILS;
const {isObject} = UTILS;

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
	    if (isObject(clientData[prop])) {
		expect(clientData[prop]).toEqual(serverDoc[prop]);
	    } else {
		expect(clientData[prop]).toBe(serverDoc[prop]);
	    }
	}
    }

    if (count) {
	return console.error("Not All Client Properties Verified");
    }
    return true;
}

module.exports = {
    TEST_UTILS : {
	verifyClientServer : verifyClientServer
    }
}
