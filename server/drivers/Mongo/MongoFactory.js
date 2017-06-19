
const Emitter = require("events");
const emtr = new Emitter();

const {UTILS} = require("./TOOLS");
const {NODE_ERRORS} = require("./TOOLS");

const {ERRNO} = NODE_ERRORS;
const {CUSTOM_ERRNO} = NODE_ERRORS;
const {makeErrno} = NODE_ERRORS;
const {NO_CLIENT_REQUEST} = CUSTOM_ERRNO;
const {FAILED_QUERY} = CUSTOM_ERRNO;
const {FAILED_UPDATE} = CUSTOM_ERRNO;
const {ECINVAL} = CUSTOM_ERRNO;
const {ESINVAL} = CUSTOM_ERRNO;
const {isFunc} = UTILS;
const {isObject} = UTILS;

const MODE = {
    
    NEW_ENTRY   : "NEW_ENTRY",
    QUERY_ID    : "QUERY_ID",
    QUERY_PROP  : "QEURY_PROP",
    UPDATE_ID   : "UPDATE_ID",
    REMOVE_ID   : "REMOVE_ID"
}

function findDocuments(req, Model) {

    var arr = [];
    return new Promise((resolve, reject) => {

	emtr.on("SUCCESS", () => {
	    resolve(arr);
	});

	var clientArr = req.body;
	for (let ii = 0; ii < clientArr.length; ii++) {

	    let ele = clientArr[ii];
	    if (ele._id) {
	    
		Model.findById(ele._id)
		    .then((res) => {
			if (!res) {
			    reject(makeErrno(FAILED_QUERY,
			     		     `Failed to Locate ${ele}`));
			}
			arr.push(res);
			if (ii === req.body.length - 1) {
			    emtr.emit("SUCCESS");
			}
		    })
		    .catch((err) => reject(err));
	    }
	}
    });
}

function generateDocuments(req, Model) {

    var arr = [];
    var clientArray = req.body;
    for (let ii = 0; ii < clientArray.length; ii++) {

	let ele = clientArray[ii];
	if (ele._id || ele.__v) {
	    console.warn(`Client Request ${ele} Contains Mongo ID ` +
			 `Use Update to Modify Document`);
	    continue;
	}

	console.log("Model.schema.obj")
	for (var prop in ele) {
	    
	    if (!Model.schema.obj.hasOwnProperty(prop)) {
		var model_name = Model.collection.collectionName;
		console.warn(`Request property ${prop} not in ${model_name}`);
		delete ele[prop];
	    }
	}

	arr.push(new Model(ele));
    }

    return (arr.length > 0)
	? arr
	: makeErrno(ECINVAL, "Client Failed to Provide Neccesary " +
		    "Data to Generate New Mongo Documents");
}

function ModelFactory(req, Model, isQuery) {

    return new Promise((resolve, reject) => {

	if (!req) {
	    reject(makeErrno(NO_CLIENT_REQUEST,
			     "ModelFactory Cannot Generate Documents"));
	}

	if (!isObject(req) || !req.body || !Array.isArray(req.body)) {
	    reject(makeErrno(ECINVAL,
			     "ModelFactory Only Accepts Array Inputs"));
	}

	if (!(Model && isFunc(Model) && Model.schema && Model.schema.obj)) {
	    reject(makeErrno(ESINVAL,
			     "Invalid Model: No Schema Object Present"));
	}

	if (isQuery) {
	    findDocuments(req, Model)
		.then((arr) => {
		    resolve(arr);
		})
		.catch((err) => reject(err));
	} else {
	    var res = generateDocuments(req, Model);
	    if (!Array.isArray(res)) {
		reject(res);
	    }
	    resolve(res);
	}

    });
}

module.exports = {
    ModelFactory : ModelFactory
}


/*
function SingleFactory(req, Model, mode, update) {

    return new Promise((resolve, reject) => {
	
	if (!req) {
	    reject(makeErrno(NO_CLIENT_REQUEST,
			     "SingleFactory Cannot Generate Documents"));
	}

	if (!(Model && isFunc(Model) && Model.schema && Model.schema.obj)) {
	    reject(makeErrno(ESINVAL,
			     "Invalid Model: No Schema Object Present"));
	}

	switch (mode) {
	    
	case MODE.NEW_ENTRY:
	    try {
		resolve(makeDocument(req, Model));
	    } catch (err) {
		reject(err);
	    }
	    break;
	    
	case MODE.QUERY_ID:
	    if (!ObjectID.isValid(req)) {
		reject(makeErrno(ECINVAL,
				 "Invalid ID: ${req} Cannot Query Database"));
	    }
	    Model.findById(res)
		.then((doc) => resolve(doc))
		.catch((err) => reject(err));

	case MODE.UPDATE_ID:
	    if (!ObjectID.isValid(req)) {
		reject(makeErrno(ECINVAL,
				 "Invalid ID: ${req} Cannot Update Database"));
	    }
	    Model.findByIdAndUpdate
	default:
	    reject(makeErrno(ESINVAL,
			    "Invalid Mode: ${mode} Passed To Single Factory"));
	}
    });
}

function makeDocument(req, Model) {

    if (req._id || res.__v) {
	throw makeErrno(ECINVAL,`Client Request ${req} Contains Mongo ID`);
    }
    
    for (var prop in req) {
	    
	if (!Model.schema.obj.hasOwnProperty(prop)) {
	    var model_name = Model.collection.collectionName;
	    console.warn(`Request property ${prop} not in ${model_name}`);
	    delete ele[prop];
	}
    }
    return new Model(req);
}
*/
