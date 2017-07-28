const {authenticate}     = require("./authenticate.js");
const {authEither}       = authenticate;
const {authAdmin}        = authenticate;
const {authUser}         = authenticate;
const {authRegistration} = authenticate;
const {parseQueries} = require("./parseQueries.js");

module.exports = {
    MIDDLEWARE : {
	authenticate     : authenticate,
	authEither       : authEither,
	authAdmin        : authAdmin,
	auhtUser         : authUser,
	authRegistration : authRegistration,
	parseQueries     : parseQueries
    }
}
