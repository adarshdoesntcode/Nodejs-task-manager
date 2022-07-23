const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const sharp = require('sharp');

const Users = require('../models/users');
const auth = require('../middleware/auth');
const {sendWelcomeEmail, sendGoodbyeEmail} = require('../email/account');

const router = new express.Router();

//--------------SIGN UP---------------

router.post('/users/',async (req,res)=>{
  const user = new Users(req.body)
  try{
    
    const result= await user.save();
    sendWelcomeEmail(user.email,user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({result,token});
  }catch(e){
    res.status(400).send(e);
  }
})


//--------------LOG IN---------------

router.post('/users/login',async(req,res)=>{
  try{
    const user = await Users.getByCredentials(req.body.email,req.body.password);
    const token = await user.generateAuthToken();
    res.send({user,token});
  }catch(e){
    res.status(400).send(e);
  }
})


//--------------GET PROFILE---------------

router.get('/users/me',auth,async(req,res)=>{
  res.send(req.authorizedUser);
})


//--------------LOG OUT---------------

router.post('/users/logout',auth, async(req,res)=>{
  try{
    req.authorizedUser.tokens = req.authorizedUser.tokens.filter((tokenObj)=>{
      return tokenObj.token != req.authorizedToken;
    })

    await req.authorizedUser.save();
    res.send("Logged out");
  }catch(e){
    res.send(500).send();
  }
})


//--------------LOGOUT ALL---------------

router.post('/users/logoutAll',auth, async(req,res)=>{
  try{
    req.authorizedUser.tokens = [];

    await req.authorizedUser.save();
    res.send("Logged out All")
  }catch(e){
    res.send(500).send();
    
  }
})


//--------------UPDATE USER---------------

router.patch('/users/me',auth,async(req,res)=>{
  const updates = Object.keys(req.body);
  const validUpdates=['name','email','age','password'];
  const isValid = updates.every((key)=> validUpdates.includes(key));

  if(!isValid){
    return res.status(400).send({error:"Invalid Update"});
  }

  try{
    updates.forEach( update => req.authorizedUser[update] = req.body[update]);
    await req.authorizedUser.save();
    res.send(req.authorizedUser);
  }catch(e){
    res.status(500).send(e);
  }

})


//--------------DELETE USER---------------

router.delete('/users/me',auth,async(req,res)=>{
  try{
    await req.authorizedUser.remove()
    sendGoodbyeEmail(req.authorizedUser.email, req.authorizedUser.name);
    res.send(req.authorizedUser);
  }catch(e){
    res.status(500).send(e);
  }
})

//--------------UPLOAD PROFILE PICTURE---------------

const upload = multer({
  limits:{
    fileSize:1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
      return cb(new Error("Supported files: jpeg,png,jpg"),undefined);
    }
    cb(undefined,true);
  }
})

router.post('/users/me/avatar',auth,upload.single('avatar'), async (req,res)=>{

  const buffer = await sharp(req.file.buffer).resize({width:300,height:300}).png().toBuffer();
  req.authorizedUser.avatar = buffer;
  await req.authorizedUser.save();
  
  res.send();
},(error,req,res,next)=>{
  res.status(400).send({error:error.message})
})

//--------------DELETE PROFILE PICTURE---------------

router.delete('/users/me/avatar',auth,async (req,res)=>{
  try{
    req.authorizedUser.avatar = undefined;
    await req.authorizedUser.save();
    res.send();
  }catch(e){
    res.status(500).send(e);
  }
})

//--------------GET PROFILE PICTURE---------------
router.get('/users/:id/avatar',async (req,res)=>{
  try{
    const user = await Users.findById(req.params.id)
    if(!user || !user.avatar){
      throw new Error();
    }

    res.set('Content-Type','image/jpg');
    res.send(user.avatar);
  }catch(e){
    res.status(404).send(e);
  }
})
module.exports = router;