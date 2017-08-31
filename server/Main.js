"use strict"

const {LIBRARY}          = require("./library");
const {NODE_LIB}         = LIBRARY;
const {express}          = NODE_LIB;
const {bodyParser}       = NODE_LIB;

const {MIDDLEWARE}       = require("./Middleware");
const {authRegistration} = MIDDLEWARE;

const {ROUTES}           = require("./Routes");

/* Create the Main Application */
var main = express();
main.use(bodyParser.json());

/* Mount The Routes onto the Main Application Server */
main.use("/admin", ROUTES.Admin);
main.use("/user(s)?", ROUTES.User);
main.use("/play(s)?", ROUTES.Play);

/* All Users and Admins Excluding the Root Admin Must Register */
main.patch("/register", authRegistration, (req, res) => {

    var {password} = req.body;
    var oldUser = req.oldUser;

    /* Change the password. clearToken() will invkoke a save call. */
    oldUser.password = password;
    oldUser.swapToken("newUser", oldUser.access).then((tok) => {
	res.send({token : tok});
    }).catch((err) => {
	res.status(400).send(err);
    });
});

main.listen(3000, () => {
    console.log("The Main Application is Listening on Port 3000");
});

module.exports = {
    main : main
};
