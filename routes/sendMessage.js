const express = require('express');
const router = express.Router();
const Messenger = require('../models/message');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');

router.get("/", async(req,res) =>{
    try{
        const msg = await Massenger.find().select('receiver_id sender_id text emoji iamge');
        res.json(msg);
    }catch(error){
        res.send("Error to get message");
    }
});

// send messenger
router.post('/', verify, async(req, res) =>{
    const msg = new Messenger({
        sender_id : req.user.id,
         receiver_id : req.body.receiver_id,
        text : req.body.text
    })
    try {
        const saveMessage = await msg.save();
        res.json(saveMessage).send(res.body);
    } catch (error) {
         res.json({message : error})
    }
});

// get send message
router.get('/sendMessage', verify, async(req, res) =>{
    console.log('get send Message');
    const msg = await Messenger.find({$and: [{sender_id : req.user.id},{receiver_id : req.body.id}] });
    console.log(msg);
    res.send(msg).select('text createdAt');
});

// get receiver message
router.get('/receiverMessage', verify, async(req, res) =>{
    const msg =  await Messenger.find({$and: [{sender_id : req.user.id},{receiver_id : req.body.id}] });
    res.send(msg).select('text createdAt ');
})

// get 







module.exports = router;