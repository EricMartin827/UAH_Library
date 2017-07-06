const express = require("express");
const bodyParser = require("body-parser");

const {UTILS} = require("./../TOOLS");
const {TEST_UTILS} = require("./../TOOLS");
const {CONSTANTS} = require("./../TOOLS");
const {NODE_ERRORS} = require("./../TOOLS");

const {app} = UTILS;
const {printObj} = UTILS;
const {logErrno} = NODE_ERRORS;

const {Control} = require("./../MongoModels")

"use strict"
function initMode(req, res) {

    try {
	var Mode = Control(req.params.mode);
    } catch (err) {
	logErrno(err);
	res.status(400).send(err);
	return null;
    }
    return Mode;
}

/***********************************************************************/
/************************* Add Request  ********************************/
/***********************************************************************/
app.post("/:mode", (req, res) => {

    var Mode;
    if ((Mode = initMode(req, res))) {
	Mode.addNewEntry_ModifyDatabase(req, res);
    }
});


app.post("/:mode/batch", (req, res) => {

    var Mode
    if ((Mode = initMode(req, res))) {
	Mode.addMultipleDocuments_ModifyDatabase(req)
	    .then((docs) => {
		res.send(docs);
	    })
	    .catch((err) => {
		logErrno(err);
		res.status(400).send(err);
	    });
    }
});

/***********************************************************************/
/************************* Query Request  ******************************/
/***********************************************************************/
app.post("/query/:mode", (req, res) => {

    var Mode;
    if ((Mode = initMode(req, res))) {
	Mode.findFirstOneByProp_QueryDatabase(req)
	    .then((doc) => {
		res.send(doc);
	    })
	    .catch((err) => {
		logErrno(err);
		res.status(400).send(err);
	    });
    }
});

/* Need To design this better. App needs routers :/ */
app.get("/:mode/batch/:limit/:sort", (req, res) => {

    if ((Mode = initMode(req, res))) {
	Mode.findMultipleDocuments_QueryDatabase(req)
	    .then((docs) => {
		res.send(docs);
	    })
	    .catch((err) => {
		logErrno(err);
		res.status(400).send(err);
	    });
    }
});

app.get("/:mode/:id", (req, res) => {

    var Mode;
    if ((Mode = initMode(req, res))) {
	Mode.findOneByID_QueryDatabase(req)
	    .then((doc) => {
		res.send(doc);
	    })
	    .catch((err) => {
		logErrno(err);
		res.status(400).send(err);
	    });
    }
});

/***********************************************************************/
/************************* Update Requests *****************************/
/***********************************************************************/

app.patch("/:mode", (req, res) => {

    var Mode;
    if ((Mode = initMode(req, res))) {
	Mode.findFirstOneByProp_UpdateDatabase(req)
	    .then((doc) => {
		res.send(doc);
	    })
	    .catch((err) => {
		logErrno(err);
		res.status(400).send(err);
	    });
    }
});

app.patch("/:mode/:id", (req, res) => {

    var Mode;
    if ((Mode = initMode(req, res))) {
	Mode.findOneByID_UpdateDatabase(req)
	    .then((doc) => {
		res.send(doc);
	    })
	    .catch((err) => {
		logErrno(err);
		res.status(400).send(err);
	    });
    }
});


/***********************************************************************/
/************************* Delete Requests *****************************/
/***********************************************************************/

app.delete("/:mode", (req, res) => {

    var Mode;
    if ((Mode = initMode(req, res))) {
	Mode.removeFirstOneByProp_ModifyDatabase(req)
	    .then((awk) => {
		res.send(awk);
	    })
	    .catch((err) => {
		logErrno(err);
		res.status(400).send(err);
	});
    }
});

app.delete("/:mode/:id", (req, res) => {

    var Mode;
    if ((Mode = initMode(req, res))) {
	Mode.removeOneByID_ModifyDatabase(req)
	    .then((awk) => {
		res.send(awk);
	    })
	    .catch((err) => {
		logErrno(err);
		res.status(400).send(err);
	});
    }
});

/* Bind The Port */
app.listen(3000, () => {
    console.log("Starting MongoDB server on port 3000");
});

module.exports = {app};
