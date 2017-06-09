/**
 * The CONSTANTS.js file stores all the commonly
 * used strings used in NodeJS to indetify events
 * and the objects used to set low level
 * configuration options such a setting the properties
 * of a connection. This files primary purpose is to
 * prevent run-time errors due to misspelled strings.
 * It is also a convenint location for maintianing
 * configuration options which could vary from server
 * to server.
 *
 * @author Eric William Martin
 * @module CONSTANTS 
 */


/**
 * Constants used to indentify the various events which
 * occur during a newtwork connection to a remote
 * database.
 *
 * @property NETWORK_EVENTS
 * @final
 * @type {Object}
 */
NETWORK_EVENTS = {
    OPEN: "open",
    CONNECTED: "connected",
    CONNECTING: "connecting",
    RECONNECT: "reconnected",
    CLOSE: "close",
    DISCONNECTED: "disconnected",
    DISCONNECTING: "disconnecting",
    ERROR: "error"
};


/**
 * A collection of configuration objects used to
 * simplify the task of setting the properties
 * of low level tasks.
 *
 * @property CONFIG
 * @final
 * @type {Object}
 */
CONFIG = {

    /**
     * Configuration object used to configure the
     * network properties betweeen the server and the
     * remote database.
     *
     * @property CONN_OPTS
     * @final
     * @type {Object}
     */
    CONN_OPTS : {
	socketOptions: {keepAlive: 1000, connectTimeOutMS: 3000}
    }
};


/* Export CONSTANTS to other modules. */
module.exports = {
    NETWORK_EVENTS,
    CONFIG
};
