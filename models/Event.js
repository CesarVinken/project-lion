const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    date: Date,
    picture: String,
    location: {
      country: String,
      city: String,
      street: String
    },
    description: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true
    },
    user: Schema.Types.ObjectId,
    attendees: [Schema.Types.ObjectId],
    counter: {
      type: Number,
      default: 1
    }
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
