/**
 * UserApp.js is the sub application used by the students of UAH.
 * 
 */

const {ERROR_LIB} = require("./LIB");
const {CUSTOM_ERRNO} = ERROR_LIB;
const {makeErrno} = ERROR_LIB;
const {ECINVAL} = CUSTOM_ERRNO;

const {LIBRARY} = require("./LIB");
const {NODE_LIB} = LIBRARY;
const {CUSTOM_LIB} = LIBRARY;
const {express} = NODE_LIB;
const {bodyParser} = NODE_LIB;
const {printObj} = CUSTOM_LIB;


const {Mongo} = require("./../Schemas");
const {Schemas} = require("./../Schemas");
const {User} = Schemas;


const {MID_WARE} = require("./../middleware");
const {authenticate} = MID_WARE;
const {authUser} = authenticate;
const {authRegistration} = authenticate;


var userApp = new express.Router();
userApp.use(bodyParser.json());

userApp.patch("/login", (req, res) => {

    var user = req.body;
    if (!(user.email && user.password)) {
	return res.status(400).send(
	    makeErrno(ECINVAL,
		      `User Failed To Provide Their Email And Password`));
    }

    User.findByCredentials(user.email, user.password)
	.then((user) => {
	    var token;
	    if (token = user.getRegisterToken()) {
		res.header("x-register", token).send(user);
	    } else {
		user.initAuthToken("user").then((token) => {
		    res.header("x-user", token).send(user);
		}).catch((err) => {
		    res.status(400).send(err);
		})
	    }
	})
	.catch((err) => {
	    res.status(401).send(err);
	})
});

userApp.patch("/logout", authUser, (req, res) => {

    var user = req.header["x-user"];
    user.clearToken("user").then(() => {
	res.send(user);
    }).catch((err) => {
	res.status(400).send(err);
    });
});

userApp.get("/me", authUser, (req, res) => {

    var user = req.header["x-user"];
    res.send(user);
});

module.exports = {userApp};


