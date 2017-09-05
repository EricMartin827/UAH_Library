const {adminRoutes} = require("./AdminRoutes.js");
const {userRoutes}  = require("./UserRoutes.js");
const {apiRoutes}   = require("./API");

module.exports = {
    ROUTES : {
	Admin : adminRoutes,
	User  : userRoutes,
	API   : apiRoutes
    }
}
