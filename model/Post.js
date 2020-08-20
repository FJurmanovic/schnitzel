const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({ //Creates new mongoose schema(Model) for posts
  title: {
    type: String,
    required: true
  },
  type: {
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
  description: {
    type: String,
    required: true
  },
  categories: [],
  userId: {
    type: String,
    required: true
  },
  points: [{
    _id: false,
    userId: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  ingredients: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number
    },
    unit: {
      type: String
    }
  }],
  directions: {
    type: String,
  },
  comments: [{
    comment: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    points: [{
      _id: false,
      userId: {
        type: String
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    reply: [{
      comment: {
        type: String,
        required: true
      },
      userId: {
        type: String,
        required: true
      },
      points: [{
        _id: false,
        userId: {
          type: String
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }],
      createdAt: {
        type: Date,
        default: Date.now()
      }
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("post", PostSchema);