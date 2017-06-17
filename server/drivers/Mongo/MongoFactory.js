const {UTILS} = require("./TOOLS");
const {isFunc} = UTILS;
const {isObject} = UTILS;


function ModelFactory(req, Constr) {
    
    if (!req) {
    	return console.error("Client Failed To Send Request");
    }

    if (!isObject(req) || !req.body || !Array.isArray(req.body)) {
	return console.error("Client Failed To Send Array of Objects");
    }

    if (Constr) {
	if (!isFunc(Constr) || !Constr.schema || !Constr.schema.obj) {
	    return console.error("Invalid Contructor: No Schema Object Present");
	}
	return makeNewDocuments(req, Constr);
    }
    return req.body;
}

function makeNewDocuments(req, Constr) {

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

module.exports = {
    ModelFactory : ModelFactory
}
