const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

// app.use((req,res,next)=>{
//   res.status(503).send("SITE UNDER MAINTENANCE!!");
//   next();
// })

app.use(express.json()); //converts json response into object
app.use(userRouter);
app.use(taskRouter);


app.listen(port,()=>{
  console.log(`Server started on port ${port}`);
})