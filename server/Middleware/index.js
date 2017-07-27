const {authenticate} = require("./authenticate.js");
const {parseQueries} = require("./parseQueries.js");

module.exports = {
    MIDDLEWARE : {
	authenticate : authenticate,
	parseQueries : parseQueries
    }
}
