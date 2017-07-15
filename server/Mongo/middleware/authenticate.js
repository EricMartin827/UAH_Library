/* Import Error Libraries */
const {ERROR_LIB} = require("./LIB");
const {CUSTOM_ERRNO} = ERROR_LIB;
const {makeErrno} = ERROR_LIB;
const {ECINVAL} = CUSTOM_ERRNO;
const {NO_USER} = CUSTOM_ERRNO;
const {EPERM} = CUSTOM_ERRNO;


const {Schemas} = require("./../Schemas");
const {User} = Schemas;

function authEither(req, res, next) {

    if (req.header("x-admin")) {
	authAdmin(req, res, next);	
    }

    if (req.header("x-user")) {
	authUser(req, res, next);
    }

    res.status(401).send(makeErrno(
	ECINVAL, `Client Failed to Send Authentication Token`));
}


function authAdmin(req, res, next) {

    var token = req.header("x-admin");
    if (!token) {
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
    if (!token) {
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
	res.status(401).send(err)
    });
}

function authRegistration(req, res, next) {

    var token = req.header("x-register");
    if (!token) {
	return res.status(401).send(
	    makeErrno(ECINVAL,
		      `Client Failed to Send Registration Token`));
    }

    User.findByToken(token, "newUser").then((user) => {

	if (!user) {
	    return Promise.reject(makeErrno(
		NO_USER, `User With Valid Registration Token Not Found`));
	}

	req.oldUser = user;
	req.token = token;
	next();
	
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
