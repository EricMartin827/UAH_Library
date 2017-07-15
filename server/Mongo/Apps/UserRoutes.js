"use strict"

const {ERROR_LIB} = require("./LIB");
const {makeErrno} = ERROR_LIB;
const {CUSTOM_ERRNO} = ERROR_LIB;
const {ECINVAL} = CUSTOM_ERRNO;

const {LIBRARY} = require("./LIB");
const {NODE_LIB} = LIBRARY;
const {CUSTOM_LIB} = LIBRARY;
const {express} = NODE_LIB;
const {bodyParser} = NODE_LIB;
const {isArray} = CUSTOM_LIB;

const {MID_WARE} = require("./../middleware");
const {authenticate} = MID_WARE;
const {authEither} = authenticate;
const {authAdmin} = authenticate;

const {Schemas} = require("./../Schemas");
const {User} = Schemas;

var userRoutes = new express.Router();
userRoutes.use(bodyParser.json());


userRoutes.get("/me", authEither, (req, res) => {

    var user = req.header("x-admin");
    if (user) {
	return res.send(user);
    }
    res.send(req.header["x-user"]);
})

function addUser(data) {

    return new Promise((resolve, reject) => {
	var user = new User(data);
	user.save().then(() => {
	    user.initAuthToken("newUser").then((tok) => {
		resolve(user);
	    }).catch((err) => rejecet(err));
	}).catch((err) => reject(err));
    });
}

async function addMultipleUsers(data) {

    for (let ii = 0; ii < data.length; ii++) {
	data[ii] = await addUser(data[ii]);
    }
    return data;
}

userRoutes.post("/", authAdmin, (req, res) => {

    if (isArray(req.body)) {
	try {
	    res.send(addMultipleUsers(req.body));
	} catch (err) {
	    res.status(400).send(err);
	}
    } else {
	addUser(req.body).then((newUser) => {
	    res.send(newUser);
	}).catch((err) => {
	    res.status(400).send(err);
	})
    }
})

module.exports = {
    userRoutes : userRoutes
}
