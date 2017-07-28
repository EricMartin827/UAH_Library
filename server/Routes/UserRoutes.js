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
/*********************** User Login/Logout/Me Routes **************************/
/******************************************************************************/

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

userRoutes.patch("/logout", authUser, (req, res) => {

    var user = req.header["x-user"];
    user.clearToken("user").then(() => {
	res.send(user);
    }).catch((err) => {
	res.status(400).send(err);
    });
});

userRoutes.get("/me", authUser, (req, res) => {

    var user = req.header["x-user"];
    res.send(user);
});

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
	});
    }
})

module.exports = {
    userRoutes : userRoutes
}
