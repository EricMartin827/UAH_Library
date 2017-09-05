/**
 * The InitMongo.js file is a configuration file used to create and set the
 * the properties of MongoDB Collections. It should be loaded and excecuted in
 * a server environement prior to deployment to ensure errors such as dupicate
 * database entries are not generated for the UAH Library. This ensures
 * that there will never be multiple records describing the same entity such
 * as a student, a falculty member, a play, etc..
 */
const {MongoClient} = require("mongodb");

function InitMongoDB(host) {

    return new Promise((resolve, reject) => {
	MongoClient.connect(host, (err, db) => {

	    if (err) {
		console.log("Failed To Connect To Database")
		console.log("Cannot Confirm Database Integrity");
		return reject(err);
	    }

	    db.listCollections().toArray((err, collections) => {

		if (collections.length !== 0) {
		    console.log("Database Schemas Were Previously Set");
		    return resolve();
		}

		console.log("Detecting New Database @ ", host);
		console.log("Setting Up Database Collections ...");

		db.createCollection("plays").then((plays) => {
		    plays.ensureIndex(
			{title: 1, authorLast: 1, authorFirst: 1},
			{unique: true}).then(() => {

			    console.log("Plays Set Up")
			    db.createCollection("users").then((users) => {
				users.ensureIndex(
				    {email : 1},
				    {unique: true}
				).then(() => {
				    
				    console.log("Users Set Up")
				    console.log("Successful Set Up :) ");
				    db.close();
				    return resolve();
				})
			    });
			});
		});
	    });
	});
    });
}


module.exports = {InitMongoDB};


