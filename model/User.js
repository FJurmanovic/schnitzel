const mongoose = require("mongoose");

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const UserSchema = mongoose.Schema({ //Creates new mongoose schema for users
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isPrivate: {
    type: Boolean,
    required: true
  },
  hasPhoto: {
    type: Boolean
  },
  photoExt: {
    type: String
  },
  following: [{
    userId: String
  }],
  followers: [{
    userId: String
  }],
  points: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("user", UserSchema);