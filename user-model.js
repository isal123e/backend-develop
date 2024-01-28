const mongoose = require("mongoose");
const { Schema } = mongoose;

// export type ItemNameTypes = '',

const consumableTypes = {
  type: {
    type: String,
    enum: ["energy", "money"],
    required: true,
  },
  name: {
    type: String,
    default: null,
  },
  rarity: {
    type: String,
    enum: ["Commmon", "Uncommon", "Rare", "Epic", "Legendary"],
    default: null,
  },
  quantity: {
    type: Number,
    default: null,
  },
};

const avatarTypes = {
  avatar_name: {
    type: String,
    default: null,
  },
  avatar_image: {
    type: String,
    default: null,
  },
  rarity: {
    type: String,
    enum: ["Commmon", "Uncommon", "Rare", "Epic", "Legendary"],
    default: null,
  },
  obtained_at: {
    type: String,
    default: new Date().toISOString(),
  },
};

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
  is_new_user: {
    type: Boolean,
    default: true,
  },
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
});

const characterTypes = {
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "user",
    default: null,
  },
  character_name: {
    type: String,
    default: null,
  },
  created_at: {
    type: String,
    default: new Date().toISOString(),
  },
  avatar: {
    now_used: {
      type: Schema.Types.ObjectId,
      ref: "avatarTypes",
    },
  },
  current_rank: {
    type: String,
    enum: ["Nobody", "Junior Detektif", "Senior Detektif"],
    default: null,
  },
  current_energy: {
    type: Number,
    default: null,
  },
  played_games: [{ type: String, default: null }],
  played_chapters: [{ type: String, default: null }],
  inventory: {
    consumable: [
      {
        type: Schema.Types.ObjectId,
        ref: "consumableTypes",
        default: null,
      },
    ],
    avatar: [
      {
        type: Schema.Types.ObjectId,
        ref: "avatarTypes",
        default: null,
      },
    ],
  },
};

const User = mongoose.model("User", user);
const Character = mongoose.model("Character", characterTypes);
const Avatar = mongoose.model("Avatar", avatarTypes);
const Consumable = mongoose.model("Consumable", consumableTypes);

module.exports = { User, Character, Consumable, Avatar };
