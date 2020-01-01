const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {registerValidation, loginValidation, changePassValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const multer = require('multer')
const fileroot = require('app-root-path');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');


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

// get user
router.get("/",verify, async (req, res)=>{
    try {
        console.log(req.user.id);
        const posts = await User.find();
                            
        res.json(posts);
    } catch (error) {
        res.json({message : err});
    }
})

// get profile
router.get("/profile",verify, async (req, res)=>{
    try {
        console.log(req.user.id);
        const posts = await User.findOne({_id : req.user.id})
                            .select('_id userName email avatar') ;
        res.json(posts);
    } catch (error) {
        res.json({message : err});
    }
})

// avatar

router.post('/avatar',upload.single('avatar'), verify, async function(req, res){
    
    const findUser = await User.updateOne(
        {_id : req.user.id},
        {$set:{avatar : "localhost:3000//" + req.file.filename}})

    return res.send('localhost:3000//' + req.file.filename);
     
});

// Search by id
// router.get('/:userID', async(req, res) => {
//     try {
//         const User = await user.findById(req.params.userID);
//         res.json(User);
//     } catch (error) {
//         res.json({message : error})
//     }
// })


// Search by UserName
router.get('/:userName',verify, async(req, res) =>{
    try {
        const user = await User.findOne({userName : req.params.userName})
                               .select('_id userName email avatar') ;
        res.json(user);
    } catch (error) {
        res.json({message : error});
    }
});

 

//router
// Delete
router.delete('/:userID', async(req,res) =>{
    try {
        const removeUser = await User.remove({_id : req.params.userID});
        res.json(removeUser);

    } catch (error) {
        res.json({message : error});
    }
})


//update : change password by userName
router.patch('/changePassWord',verify, async(req, res) => {
   try {
        const updateUser = await User.findOne({_id : req.user.id});
        // input old pass
        const old = await bcrypt.compare(req.body.oldpass, updateUser.password);
        if(!old) return res.status(400).send('Wrong password'); 
        //input new pass
        //res.send('New Pass');
        const {error} = await changePassValidation(req.body) ;
        if(error) return res.status(400).send(error.details[0].message);
        //res.send('hass pass');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newpass, salt);
       // res.send('hashed');
      try {
            const update = await User.updateOne(
                {_id : req.user.id},
                {$set: {password : hashedPassword }}
          );
           res.send("Done !");
            
       } catch (error) {
           res.send("Fail to change password");
       };
     } catch (error) {
        res.send("Have error maybe not found user !!");
    }
});

// change userName

router.patch('/changeUserName', verify, async(req, res) =>{
 //   try {
        console.log(req.user.id);
     //   const updateUser = await User.findOne({_id : req.user.id});
        const newName = await req.body.newName;

        const userNameExist = await User.findOne({userName : req.body.newName});
    
        if(userNameExist) {
           //  return res.status(400).send("userName was used. Please user other name")
             return res.json({status : 0, message : 'userName was used. Please user other name' });
            };

        const update = await User.updateOne(
            {_id : req.user.id },
            {$set : {userName : newName}}
            );

            return res.json({status : 1 });

    // } catch (error) {
    //     res.send('Fail to change userName');
    // }
})





module.exports = router;