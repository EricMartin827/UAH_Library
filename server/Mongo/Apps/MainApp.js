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
mainApp.patch("/register", authRegistration, (req, resp) => {

    /* Raw JOSN Data*/
    var newUser = req.body;

    /* Mongoose Document Retrieved From Database */
    var oldUser = req.oldUser;
    if (!newUser.password) {
	return res.status(400).send(
	    makeErrno(ECINVAL, `User Registration: User Failed Tp Specify ` +
		     `A New Password`));
    }
    
    if (newUser.password === oldUser.password) {
	return res.status(400).send(
	    makeErrno(ECINVAL, `User Registration: Failed To Change Password:` +
		     ` old = ${oldUser.password} : new = ${newUser.password}`));
    }

    oldUser.password = newUser.password;
    oldUser.save().then((updatedUser) => {
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
