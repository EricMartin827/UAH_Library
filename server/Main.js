"use strict"
const {LIBRARY} = require("./LIB");
const {NODE_LIB} = LIBRARY;
const {express} = NODE_LIB;

const {MID_WARE} = require("./../middleware");
const {authenticate} = MID_WARE;
const {authRegistration} = authenticate;

const {adminApp} = require("./AdminApp.js");
const {userApp} = require("./UserApp.js");


/* Create */
var mainApp = express();

/* Mount Sub Applications Applicattions */
mainApp.use("/admin", adminApp);
mainApp.use("/", userApp);

/* All Users and Admins Excluding the Root Admin Must Register */
mainApp.patch("/register", authRegistration, (req, res) => {

    var {password} = req.body;
    var oldUser = req.oldUser;

    /* Change the password. clearToken() will invkoke a save call. */
    oldUser.password = password;
    oldUser.clearToken("newUser").then((updatedUser) => {
	res.send(updatedUser);
    }).catch((err) => {
	res.status(400).send(err);
    });
});


mainApp.listen(3000, () => {
    console.log("The App is Listening on Port 3000");
});

module.exports = {
    mainApp : mainApp
};
