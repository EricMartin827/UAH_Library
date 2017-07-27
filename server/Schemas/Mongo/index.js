const {User} = require("./User.js");
const {Play} = require("./Play.js");

module.exports = {
    Mongo : {
	User : User,
	Play : Play
    }
};
