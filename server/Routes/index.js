const {adminRoutes} = require("./AdminRoutes.js");
const {userRoutes} = require("./UserRoutes.js");
const {playRoutes} = requre("./PlayRoutes.js");

module.exports = {
    ROUTES : {
	Admin : adminRoutes,
	User  : userRoutes,
	Play  : playRoutes
    }
}
