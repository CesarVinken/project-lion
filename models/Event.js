const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    title: String,
    date: Date,
    location: {
      country: String,
      city: String,
      street: String
    },
    recurring: Boolean,
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
