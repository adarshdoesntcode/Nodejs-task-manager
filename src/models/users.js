const mongoose = require('mongoose');
const validator = require('validator');

const Users = mongoose.model('Users',{
  name:{
    type: String,
    required: true,
    trim:true
  },
  email:{
    type:String,
    required:true,
    trim:true,
    lowercase:true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Email id not valid");
      }
    }
  },
  age:{
    type:Number,
    default:0,
    validate(value){
      if(value<0){
        throw new Error("Age must be positive number");
      }
    }
  },
  password:{
    type:String,
    required:true,
    trim:true,
    minlength:6,
    validate(value) {
      if(value.toLowerCase().includes("password")){
        throw new Error("Password cannot contain 'password'");
      }
    }
  }
});

module.exports = Users