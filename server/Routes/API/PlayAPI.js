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
const {authEither}   = authenticate;
const {authAdmin}    = authenticate;
const {parseQueries} = MIDDLEWARE;

const {Schemas} = require("./../../Schemas");
const {Play} = Schemas;

var playAPI = new express.Router();
playAPI.use(bodyParser.json());

/******************************************************************************/
/******************** Private Helpers for Play API ****************************/
/******************************************************************************/

/*
 * Adds Multiple Plays to the database.
 */
async function addPlays(data) {

    for (let ii = 0; ii < data.length; ii++) {
	var play = new Play(data[ii]);
	data[ii] = await play.save();
    }
    return data;
}

/******************************************************************************/
/********************* Get Requests for Play API ******************************/
/******************************************************************************/

playAPI.get("/", parseQueries , (req, res) => {

    query = req.header["x-query"];
    Play.find(query).then((matches) => {
	res.send(matches);
    }).catch((err) => {
	res.status(400).send(err);
    });
});

playAPI.get("/:id", (req, res) => {

    var id = req.params.id;
    Play.findById(id).then((play) => {
	res.send(play);
    }).catch((err) => {
	res.status(400).send(err);
    })
});

/******************************************************************************/
/************************* Post Routes For Plays ******************************/
/******************************************************************************/


playAPI.post("/new", authAdmin, (req, res) => {

    if (isArray(req.body)) {

	addPlays(req.body).then((plays) => {
	    res.send(plays);
	}).catch((err) => {
	    res.status(400).send(err);
	});

    } else {
	
	var play = new Play(req.body);
	play.save().then(() => {
	    res.send(play);
	}).catch((err) => {
	    res.status(400).send(err);
	});
    }
});

module.exports = { playAPI };
