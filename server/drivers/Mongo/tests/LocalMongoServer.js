var express = require("express");
var bodyParser = require("body-parser");

var {Play} = require("./../MongoModels/Play.js");

var {app} = require("./../../../../utilities/AppUtils.js");
var {httpJSON2Instance} = require("./../../../../utilities/AppUtils.js");


app.post("/addOnePlay", (req, res) => {

    var cruc = httpJSON2Instance(req, Play);

    cruc.save().then(
	(doc) => {
	    console.log("Attempting To Save A Play");
	    res.send(doc);
	},
	(err) => {
	    console.error("Failed To Save Play: ", err);
	    res.status(400).send(err);
	}
    ).catch((err) => {
	console.error("Error: ", e);
    });
});


app.get("/plays", (req, res) => {
    Play.find().then(
	(plays) => {
	    res.send(plays);
	}, (err) => {
	    res.status(400).send(err);
	}
    );
});

app.listen(3000, () => {
    console.log("Starting MongoDB server on port 3000");
});

module.exports = {app};
