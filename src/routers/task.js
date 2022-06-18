const express = require('express');
// const mongoose = require('mongoose');
const Tasks = require('../models/tasks')
const router = new express.Router();


router.get('/tasks',async(req,res)=>{
  try{
    const result = await Tasks.find();
    res.send(result);
  }catch(e){
    res.status(500).send();
  }
  
})

router.get('/tasks/:id',async(req,res)=>{
  const id = req.params.id;

  try{
    const result = await Tasks.findById(id);
    if(!result){
      return res.status(404).send();
    }
    res.send(result);
  }catch(e){
    res.status(500).send();
  }
  
})

router.post('/tasks',async (req,res)=>{
  const task = new Tasks(req.body)

  try{
    const result = await task.save();
    res.status(201).send(result);
  }catch(e){
    res.status(400).send(e);
  }

})

router.patch('/tasks/:id',async(req,res)=>{
  const updates = Object.keys(req.body);
  const validUpdates=['description','completed']
  const isValid = updates.every((key)=> validUpdates.includes(key));

  if(!isValid){
    return res.status(400).send({error:"Invalid Update"});
  }
  
  try{
    const task = await Tasks.findById(req.params.id);
    // const task = await Tasks.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    if(!task){
      return res.status(404).send();
    }

    updates.forEach(update => task[update] = req.body[update]);
    await task.save();
    res.send(task);
  }catch(e){
    res.status(400).send(e);
  }

})

router.delete('/tasks/:id',async(req,res)=>{
  const id = req.params.id;
  try{
    const task =await Tasks.findByIdAndDelete(id);
  if(!task){
    return res.status(404).send({error:"Task not found with your id"});
  }
  res.send(task);
  }catch(e){
    res.status(500).send(e);
  }
})

module.exports = router;