const {adminApp} = require("./AdminApp.js");
const {userApp} = require("./UserApp.js");
const {mainApp} = require("./MainApp.js");

module.exports = {
    Apps : {
	adminApp : adminApp,
	userApp  : userApp
    },
    mainApp : mainApp
}
