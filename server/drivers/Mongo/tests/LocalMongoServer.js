
const express = require("express");
const bodyParser = require("body-parser");

const {Play} = require("./../MongoModels");
const {UTILS} = require("./../TOOLS");
const {TEST_UTILS} = require("./../TOOLS");
const {CONSTANTS} = require("./../TOOLS");
const {NODE_ERRORS} = require("./../TOOLS");

const {ModelFactory} = require("./../MongoFactory.js");
const {app} = UTILS;
const {printObj} = UTILS;
const {logErrno} = NODE_ERRORS;


app.post("/testAddOnePlay", (req, res) => {

    ModelFactory(req, Play)
	.then((playArray) => {
	    return playArray.pop().addToDatabase();
	})
	.then((doc) => {
	    res.send(doc);
	})
	.catch((err) => {
	    logErrno(err);
	    res.status(400).send(err);
	});
});

app.post("/testQueryOnePlay", (req, res) => {

    ModelFactory(req, Play)
	.then((playArray) => {
	    return Play.findOneFromDatabase(playArray.pop());
	})
	.then((doc) => {
	    res.send(doc);
	})
	.catch((err) =>{
	    logErrno(err);
	    res.status(400).send(err);
	});
});

app.post("/testUpdateOnePlay", (req, res) => {

    ModelFactory(req, Play, true)
	.then((playArray) => {
	    return Play.commitToDatabase(playArray.pop());
	})
	.then((doc) => {
	    res.send(doc);
	})
	.catch((err) => {
	    logErrno(err);
	    res.status(400).send(err);
	});
});

app.listen(3000, () => {
    console.log("Starting MongoDB server on port 3000");
});

module.exports = {app};
