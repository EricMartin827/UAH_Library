/**
 * AdminApp.js is the sub application used by the falculty members of UAH.
 */

const {LIBRARY}      = require("./../library");
const {NODE_LIB}     = LIBRARY;
const {CUSTOM_LIB}   = LIBRARY;
const {express}      = NODE_LIB;
const {bodyParser}   = NODE_LIB;
const {printObj}     = CUSTOM_LIB;

const {ERROR_LIB}    = require("./../library");
const {makeErrno}    = ERROR_LIB;
const {CUSTOM_ERRNO} = ERROR_LIB;
const {ECINVAL}      = CUSTOM_ERRNO;

const {Schemas}      = require("./../Schemas");
const {User}         = Schemas;

const {MIDDLEWARE}   = require("./../Middleware");
const {authenticate} = MIDDLEWARE;
const {authAdmin}    = authenticate;

var adminRoutes = new express.Router();
adminRoutes.use(bodyParser.json());

/* 
 * Dummy route for seeding the database with an admin during unit testing.
 * This will be removed when application is deployed to public server.
 */
adminRoutes.post("/", (req, res) => {

    var admin = new User(req.body);
    admin.save().then(() => {
	res.send(admin);
    }).catch((err) => {
	res.status(400).send(err);
    });
});

/******************************************************************************/
/*********************** Admin Login/Logout/Me Routes *************************/
/******************************************************************************/

/*
 * Public Admin Login Route
 */ 
adminRoutes.patch("/login", (req, res) => {

    var user = req.body;
    if (!(user.email && user.password)) {
	return res.status(400).send(
	    makeErrno(ECINVAL,
		      `Admin Failed To Provide Their Email And Password`));
    }

    User.findByCredentials(user.email, user.password, "admin")
	.then((admin) => {
	    var token;
	    if (token = admin.getRegisterToken()) {
		res.header("x-register", token).send(admin);
	    } else {
		admin.initAuthToken("admin").then((tok) => {
		    res.header("x-admin", tok).send(admin);
		}).catch((err) => {
		    res.status(400).send(err);
		})
	    }
	})
	.catch((err) => {
	    res.status(401).send(err);
	})
});

/*
 * Private Admin Logout Route
 */ 
adminRoutes.patch("/logout", authAdmin, (req, res) => {

    var admin = req.header["x-admin"];
    admin.clearToken("admin").then(() => {
	res.send(admin);
    }).catch((err) => {
	res.status(400).send(err);
    });
});


/*
 * Echos the currently logged in admin for this seesion.
 */
adminRoutes.get("/me", authAdmin, (req, res) => {

    var admin = req.header["x-admin"];
    res.send(admin);
});

module.exports = {adminRoutes};
