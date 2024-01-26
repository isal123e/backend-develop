const mongoose = require("mongoose");
const { Schema } = mongoose;

const user = new Schema({
  username: {
    type: String,
    default: null,
  },
  email: {
    value: {
      type: String,
      default: null,
    },
    valid: {
      type: Boolean,
      default: false,
    },
  },
  usedVerifyToken: [
    {
      type: String,
      default: null,
    },
  ],
  password: String,

  googleId: String,

  created_at: {
    type: Date,
    default: Date.now,
  },
  gender: {
    type: String,
    default: null,
  },
  age: {
    type: Number,
    default: null,
  },
  avatar: {
    placeholder: {
      type: String,
      default: null,
    },
    image_url: {
      type: String,
      default: null,
    },
  },
  player_data: {
    avatar: {
      now_used: {
        type: String,
        default: null,
      },
      collected: {
        id: {
          type: String,
          default: null,
        },
        image_url: {
          type: String,
          default: null,
        },
      },
    },
    level: {
      type: Number,
      default: null,
    },
    achievements: {
      id: {
        type: String,
        default: null,
      },
      type: {
        type: String,
        default: null,
      },
      rewards: {
        type: Object,
        default: null,
      },
    },
  },
});

const User = mongoose.model("User", user);

module.exports = { User };
