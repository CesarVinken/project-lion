const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    nativeLanguage: String,
    learningLanguages: [String],
    location: {
      country: String,
      city: String
    },
    ownEvents: [Schema.Types.ObjectId],
    events: [Schema.Types.ObjectId],
    tandems: [Schema.Types.ObjectId],
    profilePicture: String,
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
