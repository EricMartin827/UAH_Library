
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

function findDocuments(req, Model) {

    var thisErr;
    var arr = [];
    return new Promise((resolve, reject) => {

	emmiter.on("SUCCESS", () => {
	    return resolve(arr);
	});

	emtr.on("FAILURE", () => {
	    return reject(thisErr);
	});

	var clientArr = req.body;
	for (let ii = 0; ii < clientArr.length; ii++) {

	    let ele = clientArr[ii];
	    if (ele._id) {
	    
		Model.findByID(ele._id)
		    .then((res) => {
			if (!res) {
			   thisErr = makeErrno(FAILED_QUERY,
					       `Failed to Locate ${ele}`,
					       true);
			    emtr.emit("FAILURE");
			}
			arr.push(res[0]);
			if (ii === req.body.length) {
			    emmiter.emit("SUCCESS");
			}
		    })
		    .catch((err) => {
			console.error(`Failed To Locate ${ele} ` +
				      `ERROR --> ${ERRNO[err.code]}`);
			thisErr = err;
			emtr.emit("FAILURE");
		    });
	    
	    }
	}
    });
}

function generateDocuments(req, Model) {

    var arr = [];
    req.body.forEach((ele) => {

	if (ele._id || ele.__v) {
	    console.warn(`Client Request $(ele) Contains Mongo ID ` +
			 `Use Update to Modify Document`);
	    continue;
	}
	
	for (var prop in ele) {
	    
	    if (!Constr.schema.obj.hasOwnProperty(prop)) {
		var model_name = Constr.collection.collectionName;
		console.warn(`Request property ${prop} not in ${model_name}`);
		delete ele[prop];
	    }
	}
	arr.push(new Model(ele));
    });
    return (arr.length > 0) ? arr : null;
}

function ModelFactory(req, Model, isUpdate) {

    return new Promise((resolve, reject) => {

	if (!req) {
	    return reject(makeErrno(NO_CLIENT_REQUEST,
				    "ModelFactory Cannot Generate Documents"));
	}

	if (!isObject(req) || !req.body || !Array.isArray(req.body)) {
	    return reject(makeErrno(ECINVAL,
				    "ModelFactory Only Accepts Array Inputs"));
	}

	if (!(Model && isFunc(Model) && !Model.schem && !Model.schema.obj)) {
	    return reject(makeErrno(ESINVAL,
				   "Invalid Model: No Schema Object Present"));
	}

	if (isUpdate) {
	    return findDocuments(req, Model);
	}
	return resolve(generateDocuments(req, Model));
    });
}

module.exports = {
    ModelFactory : ModelFactory
}
