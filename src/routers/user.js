const express = require('express');
const Users = require('../models/users');
const auth = require('../middleware/auth');
const router = new express.Router();


//--------------SIGN UP---------------

router.post('/users',async (req,res)=>{
  const user = new Users(req.body)
  try{
    
    const result= await user.save();
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
    res.send(req.authorizedUser);
  }catch(e){
    res.status(500).send(e);
  }
})

module.exports = router;