/* Import Library */
const {LIBRARY} = require("./../library");
const {NODE_LIB} = LIBRARY;
const {CUSTOM_LIB} = LIBRARY;
const {toObject} = CUSTOM_LIB;
const {isNotDefined} = CUSTOM_LIB;
const {qString} = NODE_LIB;

/* Import Error Libraries */
const {ERROR_LIB} = require("./../library");
const {CUSTOM_ERRNO} = ERROR_LIB;
const {makeErrno} = ERROR_LIB;

function parseQueries(req, res, next) {

    var query = qString.extract(req.originalUrl);

    if (isNotDefined(query)) {
	query = {};

    } else {

	query = qString.parse(query);
	for (var prop in query) {
	    query[prop] = toObject(query[prop]);
	}

    }
    	req.header["x-query"] = query;
    	next();
}

module.exports = {
    parseQueries : parseQueries
}

