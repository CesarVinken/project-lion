const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    From: Schema.Types.ObjectId,
    To: Schema.Types.ObjectId,
    Date: Date,
    Delivered: Boolean
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Messafe;
