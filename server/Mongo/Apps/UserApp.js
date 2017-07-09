/**
 * UserApp.js is the sub application used by the students of UAH.
 * 
 */

const {ERROR_LIB} = require("./LIB");

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


var userApp = express();
userApp.use(bodyParser.json());

userApp.post("/login", (req, res) => {

    var user = req.body;
    if (!(user.email && user.password)) {
	return res.status(400).send(
	    makeErrno(ECINVAL,
		      `User Failed To Provide Their Email And Password`));
    }
    
    User.findByCredentials(user.email, user.password, "user")
	.then((user) => {
	    var token;
	    if (token = user.getRegisterToken()) {
		res.header("x-register", token).send(user);
	    } else {
		user.initAuthToken("user").then((token) => {
		    res.header("x-user", token).send(user);
		});
	    }
	})
	.catch((err) => {
	    res.status(400).send(err);
	})
});


userApp.post("/register", authRegistration, (req, res) => {

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


module.exports = {userApp};


