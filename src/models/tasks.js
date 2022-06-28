const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description:{
    type:String,
    required:true,
    trim:true
  },
  completed:{
    type:Boolean,
    default:false
  },
  author:{
    type:mongoose.Schema.Types.ObjectId,
    requied:true,
    ref:'Users'
  }
},{
  timestamps:true
})

const Tasks = mongoose.model('Tasks',taskSchema);

module.exports = Tasks