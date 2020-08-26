const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack-dev.config.js');
const history = require('connect-history-api-fallback');

const MongoServer = require("./config/database");

require("dotenv").config();

const api = require('./routes/api');

const argv = process.argv.slice(2), //Takes array of arguments from command line without first two (node server.js)
devArg = process.env.DEV || hasDev(argv) || false; //True if "--dev" is part of command line args or in .env

MongoServer();

const app = express(), //Creates express application
DIST_DIR = path.join(__dirname, 'public'), //Path to front-end folder
HTML_FILE = path.join(DIST_DIR, '/index.html'), //Entry html file
PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use(cors());


app.use('/', express.static(DIST_DIR));

app.use('/api', api);

if (devArg) { //If devArg is true, front-end will be webpack and not static files from public
    config.entry.app.unshift('webpack-hot-middleware/client?reload=true&timeout=1000');
    config.mode = "development";
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    const compiler = webpack(config);
    app.use(history());
    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath
    }));
    app.use(webpackHotMiddleware(compiler));
}

app.use("/api/logos", express.static(path.join(__dirname, '/static/logos')));

app.get('*', (_, res) => {
    res.sendFile(HTML_FILE);
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