const {Mongo} = require("./Mongo.js");
const {Play} = require("./Play.js");
const {User} = require("./User.js");

module.exports = {
    Mongo : Mongo,
    Schemas : {
	Play  : Play,
	User  : User
    }
};
