const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
   // userID : String,
    userName : String,
    password : String,
    email : String,
    avatar : String,
	
});

module.exports = mongoose.model('User', userSchema);