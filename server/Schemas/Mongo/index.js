const {User}     = require("./User.js");
const {Play}     = require("./Play.js");
const {CheckOut} = require("./CheckOut.js");

module.exports = {
    Mongo : {
	User     : User,
	Play     : Play,
	CheckOut : CheckOut
    }
};
