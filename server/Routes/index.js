const {adminRoutes} = require("./AdminRoutes.js");
const {userRoutes}  = require("./UserRoutes.js");
const {playRoutes}  = require("./PlayRoutes.js");

module.exports = {
    ROUTES : {
	Admin : adminRoutes,
	User  : userRoutes,
	Play  : playRoutes
    }
}
