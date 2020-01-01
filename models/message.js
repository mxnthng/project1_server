const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
   receiver_id: String,
   sender_id: String,
   text: String,
   emoji: String,
   linkImage: String
  }, {
    timestamps : true
  })
  module.exports = mongoose.model("Message", messageSchema);