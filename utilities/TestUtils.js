const expect = require("expect");
const {UTILS} = require("./AppUtils");
const {isFunc} = UTILS;
const {isObject} = UTILS;

function verifyClientServer(clientData, serverDoc, ignore) {

    if (arguments.length < 2) {
	return console.error("verifyClientServer requires client and server data, " +
		      "and a constructor");
    }

    if (Array.isArray(clientData) || !isObject(clientData)) {
	return console.error("Client Data Cannot Be An Array : Must Be an Object");
    }

    if (!isObject(serverDoc) || !serverDoc._id) {
	return console.error("Server Response Lacks Mongo Document ID");
    }

    ingnore = (ignore && Array.isArray(ignore)) ? new Set(ignore) : new Set();

    for (var prop in clientData) {
	if (!serverDoc.hasOwnProperty(prop) || ingnore.has(prop)) {
	    continue;
	}
	if (isObject(clientData[prop])) {
	    expect(clientData[prop]).toEqual(serverDoc[prop]);
	} else {
	    expect(clientData[prop]).toBe(serverDoc[prop]);
	}
    }
    return true;
}

module.exports = {
    TEST_UTILS : {
	verifyClientServer : verifyClientServer
    }
}
