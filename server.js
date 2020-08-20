const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack-dev.config.js');

require("dotenv").config();

const argv = process.argv.slice(2), //Takes array of arguments from command line without first two (node server.js)
devArg = process.env.DEV || hasDev(argv) || false; //True if "--dev" is part of command line args or in .env

const app = express(), //Creates express application
DIST_DIR = path.join(__dirname, 'public'), //Path to front-end folder
HTML_FILE = path.join(DIST_DIR, '/index.html'), //Entry html file
PORT = process.env.PORT || 4000;

if (devArg) { //If devArg is true, front-end will be webpack and not static files from public
    app.use(webpackDevMiddleware(webpack(config), {
        publicPath: config.output.publicPath
    }));
    app.use(webpackHotMiddleware(webpack(config)));
}

app.use('/', express.static(DIST_DIR));

app.get('*', (_, res) => {
    res.sendFile(HTML_FILE);
});

app.use(bodyParser.json());
app.use('/', (_, res) => {
    res.send("Ok");
});
app.listen(PORT, () => {
    console.log(`Server started at PORT ${PORT}`);
});

function hasDev(obj) { //function checking if "--dev" is part of command line arguments
    for (const ent of obj) {
        if(ent == '--dev'){
            return true;
        }
    }
    return false;
}