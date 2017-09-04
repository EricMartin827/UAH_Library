var webpack = require("webpack");
var path = require("path");

module.exports = {

    /* Set the entry point for the client-side application */
    entry : "./src/index.js",

    /* Name the output "object" JS file as bundle.js and place
     * it in the build directory. The path.join() function
     * appends the build directory to the absolute path __dirname.
     */
    output : {
        path : path.join(__dirname, "build"),
        publicPath : "./build",
        filename : "bundle.js"
    },

    module : {
        rules : [
            {
                use : "babel-loader",
                test : /\.jsx?$/,
                exclude : /node_modules/
            }
        ]
    },

    devServer : {
        historyApiFallback : true,
        contentBase: "./"
    }
}
