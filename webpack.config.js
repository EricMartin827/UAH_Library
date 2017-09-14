var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");

const VENDOR_LIST = [
    "react", "react-dom", "react-redux", "react-router-dom", "redux",
    "redux-form", "redux-promise", "axios"
]

module.exports = {

    /* Set the entry points for the client-side application. Produce two
     * output files. One for our files and one for 3rd party files.
     */
    entry : {
        bundle : "./src/index.js",
        vendor : VENDOR_LIST
    },

    /* Place both output files in the build directory and use their
     * respective key values in the entry object as their acutal names. In
     * other words place bundle.js and vendor.js in the build directory.
     * Chunkhash is a unique identifier for EACH rebuild. This is what allows
     * the developer browser to pick up on a changed file. In other words, if
     * you simply refresh your browser after making changes, you should see the
     * updated application. Chunkhash "busts" the developer browser's cache.
     */
    output : {
        path : path.join(__dirname, "build"),
        filename : "[name].[chunkhash].js",
        publicPath : "/"
    },

    module : {
        rules : [

            {
                use : "babel-loader",
                test : /\.jsx?$/,
                exclude : /node_modules/
            },

            {
                use : ["style-loader", "css-loader"],
                test : /\.css$/
            }
        ]
    },

    devServer : {
        historyApiFallback : true,
        contentBase: "./build"
    },

    plugins : [

        /* Look At Total Sum of Vendor and Bundle. Whatever is common
        * put into the vendor. Makes your bundle much smaller. The arguments
        * passed to the plugin functions are configuration objects. Manifest
        * gives the browser a better understanding on whether the vendors file
        * has changed. It's a workaround for the chunkhash name used in the
        * output file.
        */
        new webpack.optimize.CommonsChunkPlugin({
            names : ["vendor", "manifest"]
        }),

        new HtmlWebpackPlugin({
            template : "./src/index.html"
        })
    ]
}
