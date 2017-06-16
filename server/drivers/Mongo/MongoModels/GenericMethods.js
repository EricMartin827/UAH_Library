const {ERRNO} = require("./../TOOLS");

var cnt = 0;

var genericMethods = {

    addToDatabase : function() {
	var instance = this;
	return new Promise((resolve, reject) => {
	    instance.save()
		.then((res) => {
		    console.log("Saved Play: ", instance.title);
		    resolve(res);
		})
		.catch((err) => {
		    console.error("Failed to add Play: " + instance.title +
				  " --> ERROR: " + ERRNO[err.code]);
		    reject(err);
		});
    	});
    }
}





module.exports = {
    genericMethods : genericMethods
}
    
