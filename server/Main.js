"use strict"
const {LIBRARY} = require("./LIB");
const {NODE_LIB} = LIBRARY;
const {express} = NODE_LIB;

const {MID_WARE} = require("./Middleware");
const {authenticate} = MID_WARE;
const {authRegistration} = authenticate;


/* Create the main application */
var main = express();

/* Mount The Routes for the main application */
main.use("/admin", adminApp);
main.use("/", userApp);

/* All Users and Admins Excluding the Root Admin Must Register */
main.patch("/register", authRegistration, (req, res) => {

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


main.listen(3000, () => {
    console.log("The App is Listening on Port 3000");
});

module.exports = {
    main : mainApp
};
