const express = require('express');
require('./db/mongoose');
const Users = require('./models/users');
const Tasks = require('./models/tasks');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); //converts json response into object

// GET REQUEST HANDLERS

//Get All Users
app.get('/users',async(req,res)=>{
   try{
    const result = await Users.find();
    res.send(result);
   }catch(e){
    res.status(500).send();
   }

})

// Get User by ID
app.get('/users/:id',async(req,res)=>{
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

//Get all Tasks
app.get('/tasks',async(req,res)=>{
  try{
    const result = await Tasks.find();
    res.send(result);
  }catch(e){
    res.status(500).send();
  }
  
})

//Get one task by id
app.get('/tasks/:id',async(req,res)=>{
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

// POST REQUEST HANDLERS

//Post request for users
app.post('/users',async (req,res)=>{
  const user = new Users(req.body)
  try{
    const result= await user.save();
    res.status(201).send(result);
  }catch(e){
    res.status(400).send(e);
  }
})

//Post request for tasks
app.post('/tasks',async (req,res)=>{
  const task = new Tasks(req.body)

  try{
    const result = await task.save();
    res.status(201).send(result);
  }catch(e){
    res.status(400).send(e);
  }

})

app.listen(port,()=>{
  console.log(`Server started on port ${port}`);
})