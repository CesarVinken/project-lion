const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    title: String,
    date: Date,
    picture: {
      type: String,
      default: "placeholder.png"
    },
    location: {
      country: String,
      city: String,
      street: String
    },
    description: String,
    language: String,
    user: Schema.Types.ObjectId,
    attendees: [Schema.Types.ObjectId]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Event = mongoose.model("Events", eventSchema);
module.exports = Event;
