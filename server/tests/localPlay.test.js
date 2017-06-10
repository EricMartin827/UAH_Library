const expect = require("expect");
const request = require("supertest");

const {Play} = require("./../models/Play.js");
var {app} = require("./../databases/MongoServer.js");


beforeEach((done) => {
    Play.remove({}).then(() => {
	done();
    });
});

describe("POST /play", () => {
    it("Should Create a New Play", (done) => {
	
	var cruc = {
	    title: "The Crucible",
	    authorLast: "Miller",
	    authorFirst: "Arthur"
	}

	request(app)
	    .post("/plays")
	    .send(cruc)
	    .expect(200)
	    .expect((res) => {
		expect(res.body.title).toBe(cruc.title);
	    })
	    .end((err, res) => {
		if (err) {
		    return done(err);
		}
		Play.find().then((plays) => {
		    expect(plays.length).toBe(1);
		    expect(plays[0].title).toBe(cruc.title);
		    done();
		}).catch((err) => {
		    done(err)
		});
	    });	
    });
});
