const express = require('express');
const Tasks = require('../models/tasks')
const auth = require('../middleware/auth')
const router = new express.Router();

// -----------------CREATE TASK----------------
router.post('/tasks',auth,async (req,res)=>{
  // const task = new Tasks(req.body)
  const task = new Tasks({
    ...req.body,
    author: req.authorizedUser._id
  })
  
  try{
    const result = await task.save();
    res.status(201).send(result);
  }catch(e){
    res.status(400).send(e);
  }

})

// -----------------GET ALL TASK ----------------
router.get('/tasks',auth,async(req,res)=>{
  try{
    await req.authorizedUser.populate('tasks')
    res.send(req.authorizedUser.tasks);
  }catch(e){
    res.status(500).send();
  }
  
})

// -----------------GET TASK BY ID----------------

router.get('/tasks/:id',auth,async(req,res)=>{
  const _id = req.params.id;

  try{
    const task = await Tasks.findOne({_id, author: req.authorizedUser._id});
    if(!task){
      return res.status(404).send();
    }
    res.send(task);
  }catch(e){
    res.status(500).send();
  }
  
})


// -----------------UPDATE TASK----------------

router.patch('/tasks/:id',auth,async(req,res)=>{
  const updates = Object.keys(req.body);
  const validUpdates=['description','completed']
  const isValid = updates.every((key)=> validUpdates.includes(key));

  if(!isValid){
    return res.status(400).send({error:"Invalid Update"});
  }
  
  try{
    const task = await Tasks.findOne({_id:req.params.id, author:req.authorizedUser._id});
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

// -----------------DELETE TASK ----------------

router.delete('/tasks/:id',auth,async(req,res)=>{
  const _id = req.params.id;
  try{
    const task =await Tasks.findOneAndDelete({_id,author:req.authorizedUser._id});
  if(!task){
    return res.status(404).send({error:"Task not found with your id"});
  }
  res.send(task);
  }catch(e){
    res.status(500).send(e);
  }
})

module.exports = router;