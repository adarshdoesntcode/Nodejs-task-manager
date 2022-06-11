const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
})

userSchema.pre('save',async function(next){ 
  //using old function format cause arrow function doesnot have access to 'this'
  const user = this;

  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password,10);
  }
  

  next(); //is strictly needed to continue the program else it will remain stuck here
})



const Users = mongoose.model('Users',userSchema);

module.exports = Users;