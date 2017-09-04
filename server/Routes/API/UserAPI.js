"use strict"

const {ERROR_LIB}    = require("./../../library");
const {makeErrno}    = ERROR_LIB;
const {CUSTOM_ERRNO} = ERROR_LIB;
const {ECINVAL}      = CUSTOM_ERRNO;

const {LIBRARY}      = require("./../../library");
const {NODE_LIB}     = LIBRARY;
const {CUSTOM_LIB}   = LIBRARY;
const {express}      = NODE_LIB;
const {bodyParser}   = NODE_LIB;
const {isArray}      = CUSTOM_LIB;

const {MIDDLEWARE}   = require("./../../Middleware");
const {authenticate} = MIDDLEWARE;
const {parseQueries} = MIDDLEWARE;
const {authEither}   = authenticate;
const {authAdmin}    = authenticate;
const {authUser}     = authenticate;

const {Schemas}      = require("./../../Schemas");
const {User}         = Schemas;

var userAPI = new express.Router();
userAPI.use(bodyParser.json());

/******************************************************************************/
/******************** Private Helpers for User API ****************************/
/******************************************************************************/

/*
 * Adds a single user to the database.
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
/********************* GET Requests to User API *******************************/
/******************************************************************************/


/*
 * Queries the User Schema of the database. 
 */
userAPI.get("/", authEither, parseQueries, (req, res) => {

    var query = req.header["x-query"];
    User.find(query).then((matches) => {
	res.send(matches);
    }).catch((err) => {
	res.status(400).send(err);
    });
});


/*
 * Queries the User Schema using a specific id.
 */
userAPI.get("/:id", authEither, (req, res) => {

    var id;
    if ((id = req.params.id) === "me") {
	echo(req, res);
    } else {
	User.findById(id).then((user) => {
	    res.send(user);
	}).catch((err) => {
	    res.status(400).send(err);
	});
    }
});


/******************************************************************************/
/******************** POST Request for User API *******************************/
/******************************************************************************/

/*
 * Allows Admin to add a new user to the database. 
 */
userAPI.post("/new", authAdmin, (req, res) => {

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

module.exports = { userAPI };
