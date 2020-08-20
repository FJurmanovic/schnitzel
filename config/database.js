const mongoose = require("mongoose");
require('dotenv').config()

const MONGOURI = process.env.MONGOURI;

const InitiateMongoServer = async () => { //Connects to mongodb server
  try {
    await mongoose.connect(MONGOURI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false

    });
    console.log("Connected to DB !!");
  } 
  catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;