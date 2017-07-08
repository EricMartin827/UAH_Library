const {User} = require("./../MongoModels");


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


module.exports = {
    authenticate : {
	authAdmin : authAdmin,
	authUser  : authUser 
    }
};
