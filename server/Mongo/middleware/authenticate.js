const {Schemas} = require("./../Schemas");
const {User} = Schemas;

function authAdmin(req, res, next) {

    var token = req.header("x-admin");
    User.findByToken(token, "admin").then((admin) => {

	if (!admin) {
	    return Promise.reject();
	}

	req.user = admin;
	req.token = token;
	next();

    }).catch((err) => {
	res.status(401).send(err);
    });
}

function authUser(req, res, next) {

    var token = req.header("x-user");
    User.findByToken(token, "user").then((user) => {

	if (!user) {
	    return Promise.reject();
	}

	req.user = user;
	req.token = token;
	next();

    }).catch((err) => {
	res.status(401).send(err);
    });
}

function authRegistration(req, res, next) {

    var token = req.header("x-register");
    User.findByToken(token, "newUser").then((user) => {

	if (!user) {
	    return Promise.reject("User Lacks Registration Token");
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
	authAdmin         : authAdmin,
	authUser          : authUser,
	authRegistration  : authRegistration
    }
};
