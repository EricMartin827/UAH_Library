"use strict"

const {ERROR_LIB}    = require("./../library");
const {makeErrno}    = ERROR_LIB;
const {CUSTOM_ERRNO} = ERROR_LIB;
const {ECINVAL}      = CUSTOM_ERRNO;

const {LIBRARY}      = require("./../library");
const {NODE_LIB}     = LIBRARY;
const {CUSTOM_LIB}   = LIBRARY;
const {express}      = NODE_LIB;
const {bodyParser}   = NODE_LIB;
const {isArray}      = CUSTOM_LIB;

const {MIDDLEWARE}   = require("./../Middleware");
const {authenticate} = MIDDLEWARE;
const {parseQueries} = MIDDLEWARE;
const {authEither}   = authenticate;
const {authAdmin}    = authenticate;
const {authUser}     = authenticate;

const {Schemas}      = require("./../Schemas");
const {User}         = Schemas;

var userRoutes = new express.Router();
userRoutes.use(bodyParser.json());

/******************************************************************************/
/*********************** User Login/Logout/Me Routes **************************/
/******************************************************************************/

/*
 * Allows A Reguler User To Login
 */
userRoutes.patch("/login", (req, res) => {

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
	});
});

/*
 * Allows a Regular User To Logout.
 */
userRoutes.patch("/logout", authUser, (req, res) => {

    var user = req.header["x-user"];
    user.clearToken("user").then(() => {
	res.send(user);
    }).catch((err) => {
	res.status(400).send(err);
    });
});

/*
 * Echos the currently logged in user for this session.
 */
userRoutes.get("/me", authUser, (req, res) => {

    var user;
    res.send(req.header["x-user"]);
});

module.exports = {userRoutes};
