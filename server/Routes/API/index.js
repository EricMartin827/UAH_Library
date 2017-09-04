const {LIBRARY}    = require("./../../library");
const {NODE_LIB}   = LIBRARY;
const {express}    = NODE_LIB;
const {bodyParser} = NODE_LIB;

const {userAPI}    = require("./UserAPI.js");
const {playAPI}    = require("./PlayAPI.js");


var api = new express.Router();
api.use(bodyParser.json());

api.use("/user(s)?", userAPI);
api.use("/play(s)?", playAPI);

module.exports = {
    apiRoutes : api,
};
