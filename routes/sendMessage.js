const express = require('express');
const router = express.Router();
const Messenger = require('../models/message');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const emoji = require('node-emoji');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + file.originalname);
    }
  });

  const fileFilter = (req, file, cb) => {
      if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpeg'){
          cb(null, true);
      }else{
          cb(null, false);
      }
  };

const upload = multer({
    storage : storage,
    limits: {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter : fileFilter
});

router.get("/", async(req,res) =>{
   // try{
        const msg = await Messenger.find().select('receiver_id sender_id text emoji image');
        res.json(msg);
 //   }catch(error){
    //    res.send("Error to get message");
  //  }
});


// send messenger
router.post('/', verify, async(req, res) =>{
    const msg = new Messenger({
        sender_id : req.user.id,
         receiver_id : req.body.receiver_id,
        text : req.body.text,
       // image : "http://localhost:3000//" + req.file.filename
    })
    msg.text=emoji.emojify(msg.text);
    try {
        const saveMessage = await msg.save();
        res.json(saveMessage).send(res.body);
    } catch (error) {
         res.json({message : error})
    }
});

router.post('/image',upload.single('image'), verify, async function(req, res){
    const msg = new Messenger({
        sender_id : req.user.id,
         receiver_id : req.body.receiver_id,
        image : "http://localhost:3000//" + req.file.filename
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
    const msg = await Messenger.find({$and: [{ sender_id : req.user.id},{ receiver_id : req.body.receiver_id}]})
                                .select('text image receiver_id createdAt');
                        
    console.log(msg);
    res.send(msg);
});

// get receiver message
router.get('/receiverMessage', verify, async(req, res) =>{
    const msg =  await Messenger.find({$and: [{sender_id : req.body.sender_id},{receiver_id : req.user.id}] })
                                 .select('text image sender_id createdAt ');
    res.send(msg);
})

// get 







module.exports = router;