const {UTILS} = require("./../TOOLS");
const {express} = UTILS;
const {bodyParser} = UTILS;
const {bcrypt} = UTILS;

const {User} = require("./../MongoModels");


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

module.exports = {admin};
