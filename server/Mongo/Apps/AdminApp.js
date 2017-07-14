/**
 * AdminApp.js is the sub application used by the falculty members of UAH.
 * 
 */

const {ERROR_LIB} = require("./LIB");
const {makeErrno} = ERROR_LIB;
const {CUSTOM_ERRNO} = ERROR_LIB;
const {ECINVAL} = CUSTOM_ERRNO;


const {LIBRARY} = require("./LIB");
const {NODE_LIB} = LIBRARY;
const {CUSTOM_LIB} = LIBRARY;
const {express} = NODE_LIB;
const {bodyParser} = NODE_LIB;
const {printObj} = CUSTOM_LIB;


const {Mongo} = require("./../Schemas");
const {Schemas} = require("./../Schemas");
const {User} = Schemas;


const {MID_WARE} = require("./../middleware");
const {authenticate} = MID_WARE;
const {authAdmin} = authenticate;
const {initMode} = MID_WARE;

var adminApp = express();
adminApp.use(bodyParser.json());


/* Dummy For Inserting The First Admin */
adminApp.post("/", (req, res) => {
    
    var admin = new User(req.body);
    admin.save().then(() => {
	res.send(admin);
    }).catch((err) => {
	res.status(400).send(err);
    });
});

/* Public Route For Logging In */
adminApp.post("/login", (req, res) => {

    var user = req.body;
    if (!(user.email && user.password)) {
	return res.status(400).send(
	    makeErrno(ECINVAL,
		      `Admin Failed To Provide Their Email And Password`));
    }
 
    User.findByCredentials(user.email, user.password, "admin")
	.then((admin) => {
	    admin.initAuthToken("admin").then((tok) => {
		res.header("x-admin", tok).send(admin);
	    })
	})
	.catch((err) => {

	    res.status(401).send(err);
	})
});

/* Add New Students or Admins */
adminApp.post("/user", authAdmin, (req, res) => {

    var user = new User(req.body);
    user.save().then(() => {
	user.initAuthToken("newUser").then((token) => {
	    res.send(user);
	});
    }).catch((err) => {
	res.status(400).send(err);
    })

});

/* Private Secure Routes */
adminApp.get("/me", authAdmin, (req, res) => {
    res.send(req.user);
});



adminApp.get("/:mode/:id", authAdmin, initMode, (req, res) => {

    var Mode = req.header("x-mode");
    Mode.findByID_QueryDatabase(req, res);
    
});

module.exports = {adminApp};
