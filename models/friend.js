const mongoose = require('mongoose');
const friendSchema = new mongoose.Schema({
   // userID : Number,
    sender_id : String,
    receiver_id : String,
    status: Number
  });

  
  
  module.exports = mongoose.model("FriendList", friendSchema);
  