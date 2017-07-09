const {adminApp} = require("./AdminApp.js");
const {userApp} = require("./UserApp.js");

module.exports = {
    Apps : {
	adminApp : adminApp,
	userApp  : userApp
    }
}
