const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: {
        app: [
            "./index.js"
        ]
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].[hash].js"
    },
    devtool: "eval-source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: [ "@babel/preset-env" ]
                }
            },
            {
                test: /\.css/,
                exclude: /node_modules/,
                loader: "css-loader",
                options: {
                    sourceMap: true
                }
            }
        ]
    },
    devServer: {
        contentBase: "build",
        port: 8080
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "../index.html"
        })
    ]
};