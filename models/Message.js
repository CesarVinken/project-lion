const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  from: Schema.Types.ObjectId,
  name: String,
  to: Schema.Types.ObjectId,
  type: {
    type: String,
    enum: ["Tandem", "Event"],
    required: true
  },
  content: String,
  date: Date,
  delivered: Boolean
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
