/* Import Library */
const {LIBRARY}      = require("./../library");
const {NODE_LIB}     = LIBRARY;
const {bcrypt}       = NODE_LIB;
const {CUSTOM_LIB}   = LIBRARY;

/* Import Error Libraries */
const {ERROR_LIB}    = require("./../library");
const {CUSTOM_ERRNO} = ERROR_LIB;
const {makeErrno}    = ERROR_LIB;
const {ECINVAL}      = CUSTOM_ERRNO;
const {NO_USER}      = CUSTOM_ERRNO;
const {EPERM}        = CUSTOM_ERRNO;

const {Schemas}      = require("./../Schemas");
const {User}         = Schemas;

function authEither(req, res, next) {

    if (req.header("x-admin")) {
	return authAdmin(req, res, next);
    }

    if (req.header("x-user")) {
	return authUser(req, res, next);
    }

    res.status(401).send(makeErrno(
	ECINVAL, `Client Failed to Send Authentication Token`));
}

function authAdmin(req, res, next) {

    var token = req.header("x-admin");
    if (!token || token === "undefined") {
	return res.status(401).send(
	    makeErrno(ECINVAL,
		      `Client Failed to Send Authentication Token`));
    }

    User.findByToken(token, "admin").then((admin) => {

	if (!admin) {
	    return Promise.reject(makeErrno(
		NO_USER, `Admin With Valid Authentication Token Not Found`));
	}

	req.header["x-admin"] = admin;
	next();

    }).catch((err) => {
	res.status(401).send(err);
    });
}

function authUser(req, res, next) {

    var token = req.header("x-user");
    if (!token || token === "undefined") {
	return res.status(401).send(
	    makeErrno(ECINVAL,
		      `Client Failed to Send Authentication Token`));
    }

    User.findByToken(token, "user").then((user) => {

	if (!user) {
	    return Promise.reject(makeErrno(
		NO_USER, `User With Valid Web Authentication Not Found`));
	}

	req.header["x-user"] = user;
	next();

    }).catch((err) => {
	res.status(401).send(err);
    });
}

function authRegistration(req, res, next) {

    var token = req.header("x-register");
    if (!token || token === "undefined") {
	return res.status(401).send(
	    makeErrno(ECINVAL, `User Registration ` +
		      `Client Failed to Send Registration Token`));
    }
    if (!req.body) {
	return res.status(401).send(
	    makeErrno(ECINVAL, `User Registration ` +
		      `Client Failed to Send Registration Credentials`));
    }

    var {password} = req.body;
    if (!password) {
	return res.status(401).send(
	    makeErrno(ECINVAL, `User Registration ` +
		      `Client Failed to Send Original Password`));
    }

    User.findByToken(token, "newUser").then((user) => {

	if (!user) {
	    return Promise.reject(makeErrno(
		NO_USER, `User With Valid Registration Token Not Found`));
	}

	bcrypt.compare(password, user.password, (err, match) => {
	    if (match) {
		return res.status(400).send(makeErrno(
		    ECINVAL, `Client Failed To Change Password During ` +
			`Registration`));
	    }
	    req.oldUser = user;
	    next();
	})

    }).catch((err) => {
	res.status(401).send(err);
    })
}

module.exports = {
    authenticate : {
	authEither        : authEither,
	authAdmin         : authAdmin,
	authUser          : authUser,
	authRegistration  : authRegistration
    }
};
