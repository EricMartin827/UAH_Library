
const {ERROR_LIB} = require("./LIB");

const {NODE_LIB} = require("./LIB");
const {express} = NODE_LIB;
const {bodyParser} = NODE_LIB;
const {bcrypt} = NODE_LIB;


const {Mongo} = require("./../Schemas");
const {Schemas} = require("./../Schemas");
const {User} = Schemas;


const {MID_WARE} = require("./../middleware");
const {authenticate} = MID_WARE;
const {authAdmin} = authenticate;

var admin = express();
admin.use(bodyParser.json());



admin.post("/", (req, res) => {
    var admin = new User(req.body);
    admin.save().then(() => {
	res.send(admin);
    }).catch((err) => {
	res.status(400).send(err);
    });
});

admin.post("/login", (req, res) => {

    var user = req.body;
    if (!(user.email && user.password)) {
	return res.status(400).send(
	    makeErrno(ECINVAL, `Admin Failed To Provide Email And Password`));
    }

    User.findByCredentials(user.email, user.password, "admin")
	.then((admin) => {
	    admin.initAuthTokens("admin").then((tok) => {
		res.header("x-admin", tok).send(admin);
	    })
	})
	.catch((err) => {
	    res.status(400).send(err);
	})
});

admin.get("/me", authAdmin, (req, res) => {
    res.send(req.user);
});

module.exports = {admin};
