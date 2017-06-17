
const express = require("express");
const bodyParser = require("body-parser");

const {Play} = require("./../MongoModels");
const {UTILS} = require("./../TOOLS");
const {TEST_UTILS} = require("./../TOOLS");
const {CONSTANTS} = require("./../TOOLS");

const {ModelFactory} = require("./../MongoFactory.js");
const {app} = UTILS;
const {printObj} = UTILS;
const {httpJSON_2_ObjArr} = TEST_UTILS;

app.post("/testAddOnePlay", (req, res) => {

    var playArray = ModelFactory(req, Play);
    playArray.pop().addToDatabase()
	.then((doc) => {
	    res.send(doc);
	})
	.catch((err) => {
	    res.status(400).send(err);
	});
});

app.post("/testQueryOnePlay", (req, res) => {

    var playArray = ModelFactory(req);
    Play.findOneFromDatabase(playArray.pop())
	.then((doc) => {
	    res.send(doc);
	})
	.catch((err) => {
	    res.status(400).send(err);
	});
    
});

app.post("/testUpdateOnePlay", (req, res) => {

    //var play = ModelFactory(req).pop();
    //Play.findOneModifyDatabase(play, play)
    var playArray = ModelFactory(req, Play);
    playArray.pop().commitToDatabase()
	.then((doc) => {
	    res.send(doc);
	})
	.catch((err) => {
	    //console.log(err);
	    res.status(400).send(err);
	});
});

app.listen(3000, () => {
    console.log("Starting MongoDB server on port 3000");
});

module.exports = {app};
