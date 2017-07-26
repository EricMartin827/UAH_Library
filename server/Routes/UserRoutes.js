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
const {parseQueries} = MID_WARE;

const {Schemas} = require("./../Schemas");
const {User} = Schemas;

var userRoutes = new express.Router();
userRoutes.use(bodyParser.json());

/******************************************************************************/
/******************** Private Functions For User Routes ***********************/
/******************************************************************************/

/*
 * Adds a single new user to the database.
 */
function addUser(data) {

    return new Promise((resolve, reject) => {
	var user = new User(data);
	user.save().then(() => {
	    user.initAuthToken("newUser").then((tok) => {
		resolve(user);
	    }).catch((err) => reject(err));
	}).catch((err) => reject(err));
    });
}

/*
 * Adds multiple new users to the database.
 */
async function addMultipleUsers(data) {

    for (let ii = 0; ii < data.length; ii++) {
	data[ii] = await addUser(data[ii]);
    }
    return data;
}


/******************************************************************************/
/************************* Get Routes For Users *******************************/
/******************************************************************************/

userRoutes.get("/", authEither, parseQueries, (req, res) => {

    query = req.header["x-query"];
    User.find(query).then((matches) => {
	res.send(matches);
    }).catch((err) => {
	res.status(400).send(err);
    });
});

userRoutes.get("/:id", authEither, (req, res) => {

    var id = req.params.id;
    User.findById(id).then((user) => {
	res.send(user);
    }).catch((err) => {
	res.status(400).send(err);
    });
});

userRoutes.get("/me", authEither, (req, res) => {

    var user = req.header("x-admin");
    if (user) {
	return res.send(user);
    }
    res.send(req.header["x-user"]);
});

/******************************************************************************/
/************************* Post Routes For Users ******************************/
/******************************************************************************/

userRoutes.post("/", authAdmin, (req, res) => {

    if (isArray(req.body)) {

	addMultipleUsers(req.body).then((newUsers) => {
	    res.send(newUsers);
	}).catch((err) => {
	    res.status(400).send(err);
	});

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
