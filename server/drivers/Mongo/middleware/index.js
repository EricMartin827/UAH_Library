const {authenticate} = require("./authenticate.js");
const {initMode} = require("./initMode.js");

module.exports = {
    MID_WARE : {
	authenticate : authenticate,
	initMode     : initMode
    }
}
