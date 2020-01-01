const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {registerValidation, loginValidation, changePassValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const multer = require('multer')
const fileroot = require('app-root-path');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');

// Login
router.post('/', async(req, res) =>{
    // check syntax login
   // console.log('Login');
    const {error} = loginValidation(req.body) ;
    if(error) return res.status(400).send(error.details[0].message);
  
    // checking if email exists
   // console.log('email');
    const user = await User.findOne({email : req.body.email});
    if(!user) return res.status(400).send("Invalid Email");
    //check password
    console.log('password');
    const pwd = await bcrypt.compare(req.body.password, user.password);
    if(!pwd) return res.status(400).send("Wrong password");

    //Create and assign a token
    console.log("user", user);
    const token = jwt.sign({ id : user._id}, process.env.TOKEN_SECRET);

    res.header('user-token', token).send(token);
    


  //  res.send('Login !');
    
});


module.exports = router;