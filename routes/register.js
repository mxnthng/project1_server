const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {registerValidation, loginValidation, changePassValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const multer = require('multer')
const fileroot = require('app-root-path');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');

router.post('/', async(req, res) =>{

    //LET VALIDATE THE DATA BEFORE WE A USER
     const {error} =  registerValidation(req.body)  ;
    if(error) res.status(400).send(error.details[0].message);
        const emailExist = await User.findOne({email : req.body.email});
    if(emailExist) return  res. status(400).send("Email was used. Please use other email !");
    const userNameExist = await User.findOne({userName : req.body.userName});
    if(userNameExist) return  res. status(400).send("userName was used. Please use other userName !");
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);


        // Create a new User
        const user = new User({
        // userID : req.body.userID,
            userName : req.body.userName,
            password : hashedPassword,
            email : req.body.email,               
            });
            try {
                const saveUser = await user.save();
                res.json(saveUser).send(res.body);
            } catch (error) {
                 res.json({message : error})
            }
 
})

module.exports = router;