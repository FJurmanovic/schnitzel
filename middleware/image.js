const multer = require("multer");
//const path = require("path");
//const fs = require("fs");
//const DatauriParser  = require('datauri/parser');
//const dUri = new DatauriParser();
//const dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

const storage = multer.memoryStorage();

module.exports = multer({ storage }).single('file');