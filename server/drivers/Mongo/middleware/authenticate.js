const {User} = require("./../MongoModels");

function authenticate(req, res, next, access) {

    var tokenKey = "x-" + access;
    var token = req.header(tok_key);

    User.findByToken(token, access).then((user) => {

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


module.exports = {authenticate};
