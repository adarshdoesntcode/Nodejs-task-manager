const express = require('express');
const Tasks = require('../models/tasks');
const auth = require('../middleware/auth');
const router = new express.Router();


// -----------------CREATE TASK----------------

router.post('/tasks',auth,async (req,res)=>{
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
// tasks?completed=true/false
// tasks?limit=2&skip=0
router.get('/tasks',auth,async(req,res)=>{

  const match={}
  const sort={}

  if(req.query.completed){
    match.completed = (req.query.completed === 'true')
  }
  if(req.query.sortBy){
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === 'desc'? -1 : 1 ;
  }

  try{
    await req.authorizedUser.populate({
      path:'tasks',
      match,
      options:{
        limit:parseInt(req.query.limit),
        skip:parseInt(req.query.skip),
        sort
      }
    })
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