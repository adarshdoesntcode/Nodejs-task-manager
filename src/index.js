require('dotenv').config({
  path: './config/.env.dev'
});

const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT ;


app.use(express.json()); //converts json response into object
app.use(userRouter);
app.use(taskRouter);



app.listen(port,()=>{
  console.log(`🚀:Server started on port ${port}`);
})

