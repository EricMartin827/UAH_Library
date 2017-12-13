"use strict"

const {LIBRARY}          = require("./library");
const {NODE_LIB}         = LIBRARY;
const {express}          = NODE_LIB;
const {bodyParser}       = NODE_LIB;

const {MIDDLEWARE}       = require("./Middleware");
const {authRegistration} = MIDDLEWARE;

const {ROUTES}           = require("./Routes");

const path               = require("path");
const cors               = require("cors");


/* If the server is running at remote location (Heroku), use
 * the environment's port number. Otherwise, the application
 * is running locally and give it the default of 3000.
 */
const port = process.env.PORT || 3000;
/* Create the Main Application */
var main = express();

/*Enable Pre-flight On All Routes */
main.options("*", cors());
main.use(cors({
    exposedHeaders : ["x-admin", "x-user", "x-register"]
}));
main.use(bodyParser.json());

/* Mount The Routes onto the Main Application Server */
main.use("/admin(s)?", ROUTES.Admin);
main.use("/user(s)?", ROUTES.User);
main.use("/api", ROUTES.API);

/* All Users and Admins Excluding the Root Admin Must Register */
main.post("/register", authRegistration, (req, res) => {

    var { password } = req.body;
    var oldUser = req.oldUser;
    var tok_header = (oldUser.access === "admin") ? "x-admin" : "x-user";

    /* Change the password. clearToken() will invkoke a save call. */
    oldUser.password = password;
    oldUser.swapToken("newUser", oldUser.access).then((tok) => {
	res.header(tok_header, tok).send({token : tok, access : oldUser.access});
    }).catch((err) => {
	res.status(400).send(err);
    });
});

if (process.env.NODE_ENV !== "production") {
    const webpackMiddleware  = require("webpack-dev-middleware");
    const webpack            = require("webpack");
    const webpackConfig      = require("./../webpack.config.js");
    main.use(webpackMiddleware(webpack(webpackConfig)));

} else {
    //console.log("Finding ", path.join(__dirname, "./../build/index.html"));
    main.use("/../build", express.static(path.join(__dirnmae, "./../build")));
    // main.get("*", (req, res) => {
    //     res.sendFile(path.join(__dirname, "./../build/index.html"));
    // });
}

main.listen(port, () => {
    console.log(`The Server is Listening on Port ${port}`);
});

module.exports = {
    main : main
};
