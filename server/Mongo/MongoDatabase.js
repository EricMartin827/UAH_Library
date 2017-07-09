
/* Import Mongoose and Constants Libraries */
const {NODE_LIB} = require("./LIB");
const {CONSTANTS} = require("./LIB");
const {mongoose} = NODE_LIB;
const {NETWORK_EVENTS} = CONSTANTS;
const {CONFIG} = CONSTANTS;
const {HOSTS} = CONSTANTS;


/* Enable Mongoose Promises */
mongoose.Promise = global.Promise;

/* Mongoose will always try to recomnnect */
db = mongoose.createConnection(HOSTS.LOCAL, CONFIG.CONN_OPTS);

db.on(NETWORK_EVENTS.OPEN, () =>
      console.log("Connection Is Open"));

db.on(NETWORK_EVENTS.CONNECTED, () =>
      console.log("Connection Established"));

db.on(NETWORK_EVENTS.CONNECTING, () =>
      console.log("Cuurently Estabishing Connection"));

db.on(NETWORK_EVENTS.RECONNECT, () =>
      console.log("Attempting To Reconnect"));

db.on(NETWORK_EVENTS.CLOSE, () =>
      console.log("Connection is Closed"));

db.on(NETWORK_EVENTS.DISCONNECTED, () =>
      console.log("Connection is Disconnected"));

db.on(NETWORK_EVENTS.DISCONNECTING, () =>
      console.log("Connection is Currently Disconnecting"));

db.on(NETWORK_EVENTS.ERROR, (err) =>
      console.error("Connection Error: ". err));

process.on("SIGINT", () => {
    db.close(function() {
	console.log("Connection Killed Via App Termination");
	process.exit(0);
    });
});


module.exports = {MongoDB : db };
