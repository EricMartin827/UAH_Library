"use strict"

const {ERROR_LIB}    = require("./../../library");
const {makeErrno}    = ERROR_LIB;
const {CUSTOM_ERRNO} = ERROR_LIB;
const {ECINVAL}      = CUSTOM_ERRNO;
const {ENO_PLAY}     = CUSTOM_ERRNO;

const {LIBRARY}      = require("./../../library");
const {NODE_LIB}     = LIBRARY;
const {CUSTOM_LIB}   = LIBRARY;
const {express}      = NODE_LIB;
const {bodyParser}   = NODE_LIB;
const {isArray}      = CUSTOM_LIB;

const {MIDDLEWARE}   = require("./../../Middleware");
const {authenticate} = MIDDLEWARE;
const {authEither}   = authenticate;
const {authUser}     = authenticate;
const {authAdmin}    = authenticate;
const {parseQueries} = MIDDLEWARE;

const {Schemas} = require("./../../Schemas");
const {Play} = Schemas;
const {CheckOut} = Schemas;

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

playAPI.get("/", authEither , parseQueries , (req, res) => {

    var query = req.header["x-query"];
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
/************************* Adding Routes For Plays ****************************/
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

/******************************************************************************/
/************************* Updating Route For Plays ***************************/
/******************************************************************************/
playAPI.post("/update/:id", authAdmin, (req, res) => {

    var id = req.params.id;
    var updatePlay = req.body;
    Play.updatePlayById(id, updatePlay).then((update) => {
	res.send(update);
    }).catch((err) => {
	res.status(400).send(err);
    });
});


/******************************************************************************/
/************************* Chechout For Plays *********************************/
/******************************************************************************/

playAPI.post("/checkout/:id", authUser, (req, res) => {

    var checkOut = new CheckOut(
	{
	    playID : req.params.id,
	    userID : req.header["x-user"]._id
	});
    checkOut.save().then((checkOut) => {
	res.send(checkOut);
    }).catch((err) => {
	res.status(400).send(err);
    });

});

playAPI.post("/checkout/delete/:id", authUser, (req, res) => {

    var id = req.params.id;
    CheckOut.removeCheckOut(id, req.header["x-user"]).then((checkOut) => {
	res.send(checkOut);
    }).catch((err) => {
	res.status(400).send(err);
    });
});

/******************************************************************************/
/************************* DELETE Routes For Plays ****************************/
/******************************************************************************/
    
playAPI.post("/delete/:id", authAdmin, (req, res) => {

    var id = req.params.id;
    Play.removePlayById(id).then((play) => {
	if (!play) {
	    res.status(400).send(
		makeErrno(ENO_PLAY, `Failed to locate play id ${id}`));
	} else {
	    res.send(play);
	}
    }).catch((err) => {
	res.status(400).send(err);
    });
});

module.exports = { playAPI };
