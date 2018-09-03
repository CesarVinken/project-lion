const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    password: String,
    email: String,
    name: String,
    nativeLanguage: [String],
    learningLanguages: [String],
    location: {
      country: String,
      city: String
    },
    ownEvents: [Schema.Types.ObjectId],
    events: [Schema.Types.ObjectId],
    tandems: [Schema.Types.ObjectId],
    picture: {
      type: String,
      default: "placeholderProfile.png"
    },
    description: String,
    gender: {
      type: String,
      enum: ["Female", "Male"]
    },
    age: Number,
    blockedUsers: [Schema.Types.ObjectId]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
