const {authenticate} = require("./authenticate.js");
const {initMode} = require("./initMode.js");
const {parseQueries} = require("./parseQueries.js");

module.exports = {
    MID_WARE : {
	authenticate : authenticate,
	initMode     : initMode,
	parseQueries : parseQueries
    }
}
