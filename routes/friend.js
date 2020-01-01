const express = require('express');
const router = express.Router();
const Friend = require('../models/friend');
const User  = require('../models/user');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');

router.post('/sendRequest',verify ,async (req, res) =>{
    const  friend = new Friend({
        sender_id: req.user.id,
        receiver_id: req.body.receiver_id,
        status : 0
    })
    try {
        const saveFriend = await friend.save();
        res.json(saveFriend).send(res.body);
    } catch (error) {
        res.json({message : error});
    }

})

// get list sent request friend
// bỏ userName lấy user1 id lấy từ req.user.id
router.get('/sendRqList', verify,async(req, res) =>{ 
    try {
        const arr = [];
     //   const user1 = await User.findOne({userName : req.params.userName });
        const requestFriend = await Friend.find({sender_id : req.user.id, status : 0})
                                           .select('receiver_id');
        console.log( requestFriend[0]);
        for(var i = 0; i < requestFriend.length; i++){
            const user = await User.findOne({_id : requestFriend[i].receiver_id})
                                   .select('_id userName email  avatar');
            arr.push(user);
        }
        // const user2 = await User.find({_id : requestFriend.user2_id})
        //                          .select('_id userName email'); 
       res.json(arr);                                 
     } catch (error) {
         res.json({message : error});
     }
})



// get friend list
router.get('/friendList',verify, async(req, res) =>{
    try {
        const arr = [];
      
        const requestFriend = await Friend.find({ $or: [{ sender_id : req.user.id},{ receiver_id : req.user.id}] , status : 1})
                                           .select('receiver_id');

        for(var i = 0; i < requestFriend.length; i++){
            const rq = await User.findOne({_id : requestFriend[i].receiver_id})
                                   .select('_id userName email  avatar');
            arr.push(rq);
        }
        // const user2 = await User.find({_id : requestFriend.user2_id})
        //                          .select('_id userName email'); 
       res.json(arr);                                 
     } catch (error) {
         res.json({message : error});
     }
})


// // get your request friend
router.get('/receiverRq', verify,async(req, res) =>{
    try {
        const arr = [];
     //   const user2 = await User.findOne({userName : req.params.userName });
        const requestFriend = await Friend.find({receiver_id : new RegExp(req.user.id), status : 0})
                                           .select('sender_id');
       
        for(var i = 0; i < requestFriend.length; i++){
            const user = await User.findOne({_id : requestFriend[i].sender_id})
                                   .select('_id userName email  avatar');
            arr.push(user);     
        }
        // const user2 = await User.find({_id : requestFriend.user2_id})
        //                          .select('_id userName email'); 
       res.json(arr);                                 
     } catch (error) {
         res.json({message : error});
     }
})



// search friend

router.get('/search', verify, async(req,res) =>{
    const name = req.body.userName;
    console.log(name);
    const search = await User.find({userName : new RegExp(name)});
    res.json(search);

})



// agree request 
router.patch('/agreeRequest', verify, async(req, res) =>{
    const receiver_id = req.user.id;
    const { friendId } = req.body;
    await Friend.findOneAndUpdate({ sender_id: friendId, receiver_id }, { status: 1 });
    res.json({status : 1});

})




module.exports = router;