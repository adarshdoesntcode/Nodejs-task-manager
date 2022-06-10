const express = require('express');
require('./db/mongoose');
const Users = require('./models/users');
const Tasks = require('./models/tasks');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); //converts json response into object

// GET REQUEST HANDLERS

//Get All Users
app.get('/users',(req,res)=>{
  Users.find().then((result)=>{
    res.send(result)
  }).catch((error)=>{
    res.status(500).send();
  })
})

// Get User by ID
app.get('/users/:id',(req,res)=>{
  const id = req.params.id;
  Users.findById(id).then((result)=>{
    if(!result){
      return res.status(404).send();
    }
    res.send(result);

  }).catch((error)=>{
    res.status(500).send();
  })
})

// POST REQUEST HANDLERS

//Post request for users
app.post('/users',(req,res)=>{
  const user = new Users(req.body)
  user.save().then((result)=>{
    res.status(201).send(result);
  }).catch((error)=>{
    res.status(400).send(error);
  })
})

//Post request for tasks
app.post('/tasks',(req,res)=>{
  const task = new Tasks(req.body)
  task.save().then((result)=>{
    res.status(201).send(result);
  }).catch((error)=>{
    res.status(400).send(error);
  })
})

app.listen(port,()=>{
  console.log(`Server started on port ${port}`);
})