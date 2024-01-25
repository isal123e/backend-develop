const mongoose = require('mongoose')
const { Schema } = mongoose;


const user = new Schema({
  username: String,
  email: {
    value: String,
    valid: {
      type: Boolean,
      default: false
    },
  },
  usedVerifyToken:[{
    type: String
  }],
  password: String,
  googleId: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  gender: String,
  age: Number,
  avatar: {
    placeholder: String,
    image_url: String
  },
  player_data: {
    avatar: {
      now_used: String,
      collected:{
        id: String,
        image_url: String,
      }
    },
    level: Number,
    achievements:{
      id: String,
      type: String,
      rewards: Object
    }
  }
});

const User = mongoose.model('User', user);

module.exports = { User };
