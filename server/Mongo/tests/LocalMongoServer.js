
"use strict"
const {LIBRARY} = require("./LIB");
const {NODE_LIB} = LIBRARY;
const {express} = NODE_LIB;

const {CONSTANTS} = require("./LIB");

const {ERROR_LIB} = require("./LIB");
const {logErrno} = ERROR_LIB;

const {MID_WARE} = require("./../middleware");
const {initMode} = MID_WARE;
const {authenticate} = MID_WARE;



const {Apps} = require("./../Apps")

var {adminApp} = Apps;
var {userApp} = Apps;

var mainApp = express();
mainApp.use("/admin", adminApp);
mainApp.use("/", userApp)


mainApp.listen(3000, () => {
    console.log("The App is Listening on Port 3000");
});

module.exports = {
    mainApp : mainApp
};
