const express = require('express');
const Users = require('../models/users')
const router = new express.Router();


router.get('/users',async(req,res)=>{
  try{
   const result = await Users.find();
   res.send(result);
  }catch(e){
   res.status(500).send();
  }

})

router.get('/users/:id',async(req,res)=>{
  const id = req.params.id;
    
  try{
    const result = await Users.findById(id);
    if(!result){
      return res.status(404).send();
    }
    res.send(result);
  }catch(e){
    res.status(500).send();
  }

})

router.post('/users',async (req,res)=>{
  const user = new Users(req.body)
  try{
    const result= await user.save();
    res.status(201).send(result);
  }catch(e){
    res.status(400).send(e);
  }
})

router.patch('/users/:id',async(req,res)=>{
  const updates = Object.keys(req.body);
  const validUpdates=['name','email','age','password'];
  const isValid = updates.every((key)=> validUpdates.includes(key));
  
  if(!isValid){
    return res.status(400).send({error:"Invalid Update"});
  }

  try{
    const user = await Users.findById(req.params.id);
    // const user = await Users.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    if(!user){
      return res.status(404).send();
    }
    updates.forEach( update => user[update] = req.body[update]);
    await user.save();

    res.send(user);

  }catch(e){
    res.status(500).send(e);
  }

})

router.delete('/users/:id',async(req,res)=>{
  const id = req.params.id;
  try{
    const user =await Users.findByIdAndDelete(id);
  if(!user){
    return res.status(404).send({error:"User not found with your id"});
  }
  res.send(user);
  }catch(e){
    res.status(500).send(e);
  }
})

module.exports = router;